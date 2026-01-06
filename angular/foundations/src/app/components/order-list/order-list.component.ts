import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateHelperService } from '../../utils/date-helper.service';
import { OrderRepositoryService } from '../../data/order-repository.service';
import { Order } from '../../models/order.model';

// jQuery import - anti-pattern in Angular
declare var $: any;

/**
 * Order List Component - 500+ line component with multiple anti-patterns
 * 
 * Issues:
 * - Massive component (500+ lines)
 * - Business logic in component
 * - Direct service instantiation (no DI)
 * - jQuery usage for DOM manipulation
 * - No OnDestroy lifecycle handling
 * - Inline styles and templates
 * - Two-way binding overuse
 * - No ChangeDetectionStrategy
 * - Complex template expressions
 * - Direct parent component access
 * - Memory leaks from subscriptions
 */
@Component({
  selector: 'app-order-list',
  host: { class: 'legacy-order-list' },
  template: `
    <div class="order-list-container" [style.background-color]="containerBackgroundColor">
      <h2 [style.color]="titleColor" (click)="changeTitleColor()">Order Management</h2>
      
      <!-- Complex inline template with business logic -->
      <div class="filters" [style.display]="showFilters ? 'block' : 'none'">
        <input 
          [(ngModel)]="searchTerm" 
          (keyup)="onSearchChange($event)"
          placeholder="Search orders..."
          [style.border]="searchTerm.length > 0 ? '2px solid green' : '1px solid gray'"
        />
        
        <select 
          [(ngModel)]="statusFilter" 
          (change)="onStatusFilterChange()"
          [style.background-color]="statusFilter === 'ALL' ? 'white' : 'lightblue'"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <!-- Complex date filtering with inline business logic -->
        <div class="date-filters">
          <label>From:</label>
          <input 
            type="date" 
            [(ngModel)]="dateFrom"
            (change)="validateDateRange()"
            [style.border-color]="isDateRangeValid() ? 'green' : 'red'"
          />
          <label>To:</label>
          <input 
            type="date" 
            [(ngModel)]="dateTo"
            (change)="validateDateRange()"
            [style.border-color]="isDateRangeValid() ? 'green' : 'red'"
          />
        </div>
      </div>
      
      <!-- Performance issue: no trackBy function -->
      <div class="order-grid">
        <div 
          *ngFor="let order of getFilteredOrders(); let i = index"
          class="order-card"
          [style.background-color]="getOrderCardColor(order, i)"
          (click)="selectOrder(order, i)"
          [style.transform]="selectedOrderIndex === i ? 'scale(1.05)' : 'scale(1)'"
        >
          <!-- Complex template expressions -->
          <h3>{{ order.orderId || 'N/A' }}</h3>
          <p>Customer: {{ getCustomerDisplayName(order) }}</p>
          <p>Date: {{ formatOrderDate(order.orderDate) }}</p>
          <p>Status: 
            <span [style.color]="getStatusColor(order.status)">
              {{ order.status?.toUpperCase() || 'UNKNOWN' }}
            </span>
          </p>
          <p>Amount: {{ formatCurrency(order.totalAmount) }}</p>
          
          <!-- Inline business logic in template -->
          <div class="order-actions" *ngIf="order.status !== 'CANCELLED'">
            <button 
              *ngIf="canCancelOrder(order)"
              (click)="cancelOrder(order, $event)"
              [disabled]="isProcessingOrder(order.orderId)"
              class="btn-cancel"
            >
              Cancel
            </button>
            <button 
              *ngIf="canUpdateStatus(order)"
              (click)="updateOrderStatus(order, getNextStatus(order.status), $event)"
              [disabled]="isProcessingOrder(order.orderId)"
              class="btn-update"
            >
              {{ getNextStatusLabel(order.status) }}
            </button>
            <button 
              *ngIf="order.status === 'DELIVERED' && daysSinceDelivery(order) < 30"
              (click)="initiateReturn(order, $event)"
              class="btn-return"
            >
              Return
            </button>
          </div>
        </div>
      </div>
      
      <!-- Pagination with manual implementation -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button 
          *ngFor="let page of getPaginationNumbers()"
          (click)="goToPage(page)"
          [class.active]="currentPage === page"
          [style.background-color]="currentPage === page ? 'blue' : 'gray'"
        >
          {{ page }}
        </button>
      </div>
      
      <!-- Loading indicator with poor implementation -->
      <div *ngIf="isLoading" class="loading" [style.display]="isLoading ? 'block' : 'none'">
        <div class="spinner" [style.animation]="'spin ' + spinnerSpeed + 's linear infinite'"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    /* Inline styles - anti-pattern */
    .order-list-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: 600px;
    }
    
    .order-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .order-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background-color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .order-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .filters {
      background: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .date-filters {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .order-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .btn-cancel, .btn-update, .btn-return {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn-cancel { background: #ff4444; color: white; }
    .btn-update { background: #4444ff; color: white; }
    .btn-return { background: #ff8800; color: white; }
    
    .pagination {
      margin-top: 20px;
      text-align: center;
    }
    
    .pagination button {
      margin: 0 4px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
    }
    
    .pagination button.active {
      background: #007bff;
      color: white;
    }
    
    .loading {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      margin: 0 auto 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class OrderListComponent implements OnInit, OnDestroy {
  
  @Input('ordersData') ordersInputAlias!: Order[];
  @Output() onSelected = new EventEmitter<Order>();
  @Output() click = new EventEmitter<void>();

  // Massive component state - should be broken down
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedOrderIndex: number = -1;
  
  // Filter state
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  dateFrom: string = '';
  dateTo: string = '';
  
  // Pagination state
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // UI state
  isLoading: boolean = false;
  loadingMessage: string = 'Loading orders...';
  showFilters: boolean = true;
  containerBackgroundColor: string = '#f5f5f5';
  titleColor: string = '#333';
  spinnerSpeed: number = 2;
  
  // Business logic state (should be in service)
  processingOrders: Set<string> = new Set();
  orderStatusHistory: any[] = [];
  validationErrors: string[] = [];
  
  // Direct service instantiation - anti-pattern
  private dateHelper: DateHelperService;
  private orderRepository: OrderRepositoryService;
  
  constructor(private http: HttpClient) {
    // Manual service instantiation instead of dependency injection
    this.dateHelper = new DateHelperService();
    this.orderRepository = new OrderRepositoryService(this.http);
  }
  
  ngOnInit(): void {
    this.initializeComponent();
    this.loadOrders();
    this.setupEventListeners();
    this.startPeriodicRefresh();
    
    // Memory leak - no unsubscribe
    this.dateHelper.subscribeToDateChanges();
  }
  
  // No OnDestroy implementation - memory leaks

  ngOnDestroy(): void {}
  
  
  private initializeComponent(): void {
    // jQuery DOM manipulation - anti-pattern in Angular
    $(document).ready(() => {
      $('.order-list-container').fadeIn(500);
      this.setupjQueryEventHandlers();
    });
    
    // Direct DOM access
    const container = document.querySelector('.order-list-container');
    if (container) {
      container.addEventListener('scroll', this.onScroll.bind(this));
    }
  }
  
  private setupjQueryEventHandlers(): void {
    // More jQuery usage
    $('.order-card').hover(
      function() { $(this).addClass('hover-effect'); },
      function() { $(this).removeClass('hover-effect'); }
    );
  }
  
  private loadOrders(): void {
    this.isLoading = true;
    this.loadingMessage = 'Fetching orders from server...';
    
    // Business logic in component
    this.orderRepository.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.processOrdersData();
        this.applyFilters();
        this.calculatePagination();
        this.isLoading = false;
        
        // Nested subscription - memory leak
        this.orderRepository.getOrderStatusUpdates().subscribe(update => {
          this.handleStatusUpdate(update);
        });
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.isLoading = false;
        this.loadingMessage = 'Failed to load orders';
        
        // Poor error handling
        alert('Error loading orders: ' + error.message);
      }
    });
  }
  
  private processOrdersData(): void {
    // Business logic that should be in service
    this.orders.forEach(order => {
      // Calculate derived properties
      order.canCancel = this.calculateCanCancel(order);
      order.canReturn = this.calculateCanReturn(order);
      order.canReview = this.calculateCanReview(order);
      
      // Validate order data
      this.validateOrder(order);
    });
  }
  
  private calculateCanCancel(order: Order): boolean {
    // Complex business logic in component
    if (!order.status) return false;
    
    const cancelableStatuses = ['PENDING', 'PROCESSING'];
    if (!cancelableStatuses.includes(order.status)) return false;
    
    // Date-based validation using problematic date helper
    const orderDate = this.dateHelper.parseUserInput(order.orderDate as string);
    if (!orderDate) return false;
    
    const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceOrder <= 7; // 7-day cancellation window
  }
  
  private calculateCanReturn(order: Order): boolean {
    if (order.status !== 'DELIVERED') return false;
    
    const deliveryDate = this.dateHelper.parseUserInput(order.orderDate as string);
    if (!deliveryDate) return false;
    
    const daysSinceDelivery = (Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceDelivery <= 30; // 30-day return window
  }
  
  private calculateCanReview(order: Order): boolean {
    return order.status === 'DELIVERED';
  }
  
  private validateOrder(order: Order): void {
    // Validation logic in component
    const errors: string[] = [];
    
    if (!order.orderId) errors.push('Missing order ID');
    if (!order.customerId) errors.push('Missing customer ID');
    if (!order.totalAmount || order.totalAmount <= 0) errors.push('Invalid total amount');
    
    if (errors.length > 0) {
      this.validationErrors.push(...errors.map(e => `Order ${order.orderId}: ${e}`));
    }
  }
  
  // Complex template helper methods
  getFilteredOrders(): Order[] {
    // Performance issue: filtering in getter called on every change detection
    let filtered = this.orders.slice();
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(term) ||
        order.customerId?.toLowerCase().includes(term) ||
        this.getCustomerDisplayName(order).toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (this.statusFilter && this.statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Date filter
    if (this.dateFrom || this.dateTo) {
      filtered = filtered.filter(order => this.isOrderInDateRange(order));
    }
    
    // Pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.filteredOrders = filtered.slice(startIndex, endIndex);
    return this.filteredOrders;
  }
  
  getCustomerDisplayName(order: Order): string {
    // Template helper with business logic
    if (!order.customer) return order.customerId || 'Unknown Customer';
    
    const name = order.customer.customerName;
    if (!name) return order.customer.email || order.customerId || 'Unknown';
    
    // Poor string manipulation
    return name.length > 20 ? name.substring(0, 17) + '...' : name;
  }
  
  formatOrderDate(date: any): string {
    // Inconsistent date formatting
    if (!date) return 'N/A';
    
    try {
      const parsedDate = this.dateHelper.parseUserInput(date);
      if (!parsedDate) return 'Invalid Date';
      
      return this.dateHelper.formatDateForAPI(parsedDate, 'display');
    } catch (e) {
      return 'Error';
    }
  }
  
  formatCurrency(amount: any): string {
    // Poor currency formatting
    if (!amount) return '$0.00';
    
    try {
      const num = parseFloat(amount);
      return '$' + num.toFixed(2);
    } catch (e) {
      return '$0.00';
    }
  }
  
  getStatusColor(status: string): string {
    // Hardcoded styling logic
    switch (status) {
      case 'PENDING': return '#ffa500';
      case 'PROCESSING': return '#0066cc';
      case 'SHIPPED': return '#9900cc';
      case 'DELIVERED': return '#00cc66';
      case 'CANCELLED': return '#cc0000';
      default: return '#666666';
    }
  }
  
  getOrderCardColor(order: Order, index: number): string {
    // Complex styling logic in component
    if (this.selectedOrderIndex === index) return '#e3f2fd';
    if (order.status === 'CANCELLED') return '#ffebee';
    if (order.status === 'DELIVERED') return '#e8f5e8';
    return index % 2 === 0 ? '#ffffff' : '#f9f9f9';
  }
  
  // Event handlers with business logic
  onSearchChange(event: any): void {
    // Immediate filtering on every keystroke - performance issue
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset pagination
    this.applyFilters();
  }
  
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  validateDateRange(): void {
    // Validation in event handler
    if (this.dateFrom && this.dateTo) {
      const from = new Date(this.dateFrom);
      const to = new Date(this.dateTo);
      
      if (from > to) {
        alert('Start date cannot be after end date');
        this.dateTo = '';
      }
    }
  }
  
  isDateRangeValid(): boolean {
    // Complex validation in template helper
    if (!this.dateFrom || !this.dateTo) return true;
    return new Date(this.dateFrom) <= new Date(this.dateTo);
  }
  
  selectOrder(order: Order, index: number): void {
    this.selectedOrder = order;
    this.selectedOrderIndex = index;
    
    // jQuery animation
    $('.order-card').removeClass('selected');
    $(`.order-card:nth-child(${index + 1})`).addClass('selected');
    
    // Direct parent component communication
    const parent = (window as any).parent;
    if (parent && parent.orderSelected) {
      parent.orderSelected(order);
    }
  }
  
  // Business operations in component
  cancelOrder(order: Order, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`Are you sure you want to cancel order ${order.orderId}?`)) {
      return;
    }
    
    this.processingOrders.add(order.orderId!);
    
    // Business logic in component
    this.orderRepository.updateOrderStatus(order.orderId!, 'CANCELLED').subscribe({
      next: (result) => {
        order.status = 'CANCELLED';
        this.addToStatusHistory(order.orderId!, 'CANCELLED', 'User cancellation');
        this.processingOrders.delete(order.orderId!);
        
        // UI manipulation
        this.showSuccessMessage(`Order ${order.orderId} cancelled successfully`);
      },
      error: (error) => {
        this.processingOrders.delete(order.orderId!);
        alert(`Failed to cancel order: ${error.message}`);
      }
    });
  }
  
  updateOrderStatus(order: Order, newStatus: string, event: Event): void {
    event.stopPropagation();
    
    this.processingOrders.add(order.orderId!);
    
    this.orderRepository.updateOrderStatus(order.orderId!, newStatus).subscribe({
      next: (result) => {
        const oldStatus = order.status;
        order.status = newStatus;
        this.addToStatusHistory(order.orderId!, newStatus, `Status change from ${oldStatus}`);
        this.processingOrders.delete(order.orderId!);
        
        // Recalculate permissions
        order.canCancel = this.calculateCanCancel(order);
        order.canReturn = this.calculateCanReturn(order);
        order.canReview = this.calculateCanReview(order);
      },
      error: (error) => {
        this.processingOrders.delete(order.orderId!);
        alert(`Failed to update order status: ${error.message}`);
      }
    });
  }
  
  initiateReturn(order: Order, event: Event): void {
    event.stopPropagation();
    
    // Poor UX - alert for complex operation
    const reason = prompt('Please enter reason for return:');
    if (!reason) return;
    
    this.processingOrders.add(order.orderId!);
    
    this.orderRepository.initiateReturn(order.orderId!, reason).subscribe({
      next: (result) => {
        this.addToStatusHistory(order.orderId!, 'RETURN_INITIATED', `Return requested: ${reason}`);
        this.processingOrders.delete(order.orderId!);
        this.showSuccessMessage(`Return initiated for order ${order.orderId}`);
      },
      error: (error) => {
        this.processingOrders.delete(order.orderId!);
        alert(`Failed to initiate return: ${error.message}`);
      }
    });
  }
  
  // Utility methods that should be elsewhere
  canCancelOrder(order: Order): boolean {
    return order.canCancel && !this.processingOrders.has(order.orderId!);
  }
  
  canUpdateStatus(order: Order): boolean {
    const updatableStatuses = ['PENDING', 'PROCESSING', 'SHIPPED'];
    return updatableStatuses.includes(order.status!) && !this.processingOrders.has(order.orderId!);
  }
  
  isProcessingOrder(orderId: string): boolean {
    return this.processingOrders.has(orderId);
  }
  
  getNextStatus(currentStatus: string): string {
    // Hardcoded workflow logic
    switch (currentStatus) {
      case 'PENDING': return 'PROCESSING';
      case 'PROCESSING': return 'SHIPPED';
      case 'SHIPPED': return 'DELIVERED';
      default: return currentStatus;
    }
  }
  
  getNextStatusLabel(currentStatus: string): string {
    switch (currentStatus) {
      case 'PENDING': return 'Start Processing';
      case 'PROCESSING': return 'Mark as Shipped';
      case 'SHIPPED': return 'Mark as Delivered';
      default: return 'Update Status';
    }
  }
  
  daysSinceDelivery(order: Order): number {
    const deliveryDate = this.dateHelper.parseUserInput(order.orderDate as string);
    if (!deliveryDate) return 999;
    
    return Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  isOrderInDateRange(order: Order): boolean {
    const orderDate = this.dateHelper.parseUserInput(order.orderDate as string);
    if (!orderDate) return false;
    
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      if (orderDate < fromDate) return false;
    }
    
    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (orderDate > toDate) return false;
    }
    
    return true;
  }
  
  // Pagination methods
  getPaginationNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }
  
  // Private helper methods
  private applyFilters(): void {
    // Force re-render
    this.filteredOrders = [];
    setTimeout(() => {
      this.calculatePagination();
    }, 0);
  }
  
  private calculatePagination(): void {
    const totalItems = this.orders.length; // Should count filtered items
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
  
  private addToStatusHistory(orderId: string, status: string, note: string): void {
    this.orderStatusHistory.push({
      orderId: orderId,
      status: status,
      note: note,
      timestamp: new Date(),
      user: 'current-user' // Should get from auth service
    });
  }
  
  private showSuccessMessage(message: string): void {
    // Poor UI feedback
    alert(message);
  }
  
  private handleStatusUpdate(update: any): void {
    const order = this.orders.find(o => o.orderId === update.orderId);
    if (order) {
      order.status = update.status;
      this.addToStatusHistory(update.orderId, update.status, 'External update');
    }
  }
  
  private setupEventListeners(): void {
    // Direct DOM event listening
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }
  
  private onWindowResize(): void {
    // Responsive logic in component
    const width = window.innerWidth;
    if (width < 768) {
      this.itemsPerPage = 5;
    } else if (width < 1024) {
      this.itemsPerPage = 8;
    } else {
      this.itemsPerPage = 10;
    }
    this.calculatePagination();
  }
  
  private onKeyDown(event: KeyboardEvent): void {
    // Global keyboard shortcuts
    if (event.ctrlKey && event.key === 'f') {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder="Search orders..."]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  }
  
  private onScroll(event: Event): void {
    // Infinite scroll attempt (incomplete)
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      // Should load more items
      console.log('Near bottom - could load more items');
    }
  }
  
  private startPeriodicRefresh(): void {
    // Memory leak - interval never cleared
    setInterval(() => {
      this.refreshOrderStatuses();
    }, 30000); // Refresh every 30 seconds
  }
  
  private refreshOrderStatuses(): void {
    // Background refresh without user indication
    this.orderRepository.getOrderStatusUpdates().subscribe(updates => {
      updates.forEach(update => this.handleStatusUpdate(update));
    });
  }
  
  // UI manipulation methods
  changeTitleColor(): void {
    // Silly UI interaction
    const colors = ['#333', '#ff0000', '#00ff00', '#0000ff', '#ff8800'];
    const currentIndex = colors.indexOf(this.titleColor);
    this.titleColor = colors[(currentIndex + 1) % colors.length];
  }
}