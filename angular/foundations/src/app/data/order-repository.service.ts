import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { Order } from '../models/order.model';

/**
 * Order Repository Service with data access anti-patterns
 * 
 * Issues:
 * - Nested subscribes (subscribe hell)
 * - No error handling in HTTP calls
 * - Constructing URLs with string concatenation
 * - No request interceptors
 * - Caching logic mixed with data fetching
 * - Direct localStorage access
 * - No retry logic
 * - Synchronous operations that should be async
 */
@Injectable({
  providedIn: 'root'
})
export class OrderRepositoryService {
  
  private baseUrl = 'http://localhost:8080/api'; // Hardcoded URL
  private cache: Map<string, any> = new Map();
  private orderUpdatesSubject = new BehaviorSubject<any[]>([]);
  
  constructor(private http: HttpClient) {
    this.initializeCache();
  }
  
  /**
   * Get all orders with nested subscribes
   */
  getAllOrders(): Observable<Order[]> {
    // Check cache first
    const cachedOrders = this.getCachedOrders();
    if (cachedOrders) {
      return of(cachedOrders);
    }
    
    // No error handling, no headers, hardcoded URL
    return this.http.get(this.baseUrl + '/orders').pipe(
      map((response: any) => {
        // Assume response is array
        const orders = response as Order[];
        
        // Side effect during data fetching
        this.cacheOrders(orders);
        
        // Nested subscribe - anti-pattern
        orders.forEach(order => {
          this.getOrderDetails(order.orderId!).subscribe(details => {
            Object.assign(order, details);
            
            // Another nested subscribe
            this.getCustomerInfo(order.customerId!).subscribe(customer => {
              order.customer = customer;
            });
          });
        });
        
        return orders;
      })
    );
  }
  
  /**
   * Get order by ID with poor error handling
   */
  getOrderById(orderId: string): Observable<Order> {
    // String concatenation for URL construction
    const url = this.baseUrl + '/orders/' + orderId;
    
    return this.http.get(url).pipe(
      map((response: any) => response as Order),
      // Poor error handling
      catchError(error => {
        console.error('Order fetch failed:', error);
        return of(null as any);
      })
    );
  }
  
  /**
   * Update order status with no optimistic updates
   */
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    // Manual header construction
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    // Manual body construction
    const body = {
      orderId: orderId,
      status: status,
      updatedBy: this.getCurrentUser(), // Synchronous call
      updatedDate: new Date().toISOString()
    };
    
    return this.http.put(this.baseUrl + '/orders/' + orderId + '/status', body, { headers }).pipe(
      tap(response => {
        // Side effects in data layer
        this.invalidateCache();
        this.notifyOrderUpdate(orderId, status);
        this.updateLocalStorage(orderId, status);
      })
    );
  }
  
  /**
   * Create order with complex validation
   */
  createOrder(order: Order): Observable<Order> {
    // Client-side validation that should be on server
    if (!this.validateOrderData(order)) {
      return throwError('Invalid order data');
    }
    
    // Construct request manually
    const requestData = this.prepareOrderData(order);
    
    return this.http.post(this.baseUrl + '/orders', requestData).pipe(
      map((response: any) => {
        const createdOrder = response as Order;
        
        // More side effects
        this.addToCache(createdOrder);
        this.trackOrderCreation(createdOrder);
        
        return createdOrder;
      }),
      catchError(error => {
        // Poor error propagation
        console.error('Order creation failed:', error);
        throw new Error('Failed to create order');
      })
    );
  }
  
  /**
   * Search orders with dynamic query building
   */
  searchOrders(criteria: any): Observable<Order[]> {
    // Manual query string construction - vulnerable to injection
    let queryString = '?';
    
    if (criteria.customerName) {
      queryString += 'customerName=' + encodeURIComponent(criteria.customerName) + '&';
    }
    if (criteria.status) {
      queryString += 'status=' + criteria.status + '&';
    }
    if (criteria.dateFrom) {
      queryString += 'dateFrom=' + criteria.dateFrom + '&';
    }
    if (criteria.dateTo) {
      queryString += 'dateTo=' + criteria.dateTo + '&';
    }
    
    // Remove trailing &
    queryString = queryString.slice(0, -1);
    
    const searchUrl = this.baseUrl + '/orders/search' + queryString;
    
    return this.http.get(searchUrl).pipe(
      map((response: any) => response as Order[]),
      retry(1), // Poor retry strategy
      catchError(error => {
        // Silent failure
        return of([]);
      })
    );
  }
  
  /**
   * Get order status updates - potential memory leak
   */
  getOrderStatusUpdates(): Observable<any[]> {
    return this.orderUpdatesSubject.asObservable();
  }
  
  /**
   * Initiate return with synchronous localStorage operations
   */
  initiateReturn(orderId: string, reason: string): Observable<any> {
    // Synchronous localStorage operation
    const returnData = {
      orderId: orderId,
      reason: reason,
      requestDate: new Date().toISOString(),
      requestedBy: this.getCurrentUser()
    };
    
    localStorage.setItem('pendingReturn_' + orderId, JSON.stringify(returnData));
    
    return this.http.post(this.baseUrl + '/orders/' + orderId + '/return', returnData).pipe(
      tap(response => {
        // Remove from localStorage only on success
        localStorage.removeItem('pendingReturn_' + orderId);
      }),
      catchError(error => {
        // Keep in localStorage for retry
        console.error('Return initiation failed:', error);
        return throwError('Failed to initiate return');
      })
    );
  }
  
  // Private helper methods with poor implementations
  
  private initializeCache(): void {
    // Initialize cache from localStorage - synchronous operation
    try {
      const cached = localStorage.getItem('orderCache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.cache = new Map(Object.entries(cacheData));
      }
    } catch (e) {
      // Silent failure
      console.warn('Failed to initialize cache');
    }
  }
  
  private getCachedOrders(): Order[] | null {
    const cached = this.cache.get('allOrders');
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }
  
  private cacheOrders(orders: Order[]): void {
    this.cache.set('allOrders', {
      data: orders,
      timestamp: Date.now()
    });
    
    // Persist to localStorage - synchronous operation
    this.persistCache();
  }
  
  private addToCache(order: Order): void {
    this.cache.set('order_' + order.orderId, {
      data: order,
      timestamp: Date.now()
    });
    this.persistCache();
  }
  
  private persistCache(): void {
    try {
      const cacheObj = Object.fromEntries(this.cache);
      localStorage.setItem('orderCache', JSON.stringify(cacheObj));
    } catch (e) {
      console.warn('Failed to persist cache');
    }
  }
  
  private isCacheValid(timestamp: number): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return (Date.now() - timestamp) < fiveMinutes;
  }
  
  private invalidateCache(): void {
    this.cache.clear();
    localStorage.removeItem('orderCache');
  }
  
  private getOrderDetails(orderId: string): Observable<any> {
    return this.http.get(this.baseUrl + '/orders/' + orderId + '/details').pipe(
      catchError(error => of({}))
    );
  }
  
  private getCustomerInfo(customerId: string): Observable<any> {
    return this.http.get(this.baseUrl + '/customers/' + customerId).pipe(
      catchError(error => of({}))
    );
  }
  
  private validateOrderData(order: Order): boolean {
    // Client-side validation
    if (!order.customerId) return false;
    if (!order.totalAmount || order.totalAmount <= 0) return false;
    return true;
  }
  
  private prepareOrderData(order: Order): any {
    // Manual data transformation
    return {
      customerId: order.customerId,
      orderDate: order.orderDate || new Date().toISOString(),
      status: order.status || 'PENDING',
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      notes: order.notes
    };
  }
  
  private getCurrentUser(): string {
    // Synchronous user lookup
    return localStorage.getItem('currentUser') || 'anonymous';
  }
  
  private notifyOrderUpdate(orderId: string, status: string): void {
    const updates = this.orderUpdatesSubject.value;
    updates.push({
      orderId: orderId,
      status: status,
      timestamp: new Date()
    });
    this.orderUpdatesSubject.next(updates);
  }
  
  private updateLocalStorage(orderId: string, status: string): void {
    // Direct localStorage manipulation
    const key = 'orderStatus_' + orderId;
    localStorage.setItem(key, status);
  }
  
  private trackOrderCreation(order: Order): void {
    // Analytics tracking in data layer
    const tracking = {
      event: 'order_created',
      orderId: order.orderId,
      amount: order.totalAmount,
      timestamp: new Date()
    };
    
    // Store tracking data
    const existingTracking = localStorage.getItem('orderTracking') || '[]';
    const trackingArray = JSON.parse(existingTracking);
    trackingArray.push(tracking);
    localStorage.setItem('orderTracking', JSON.stringify(trackingArray));
  }
}