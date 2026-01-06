import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Customer } from '../models/customer.model';

/**
 * Customer Service with poor patterns
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private baseUrl = 'http://localhost:8080/api/customers';
  
  constructor(private http: HttpClient) {}
  
  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Customer fetch failed:', error);
        return of({} as Customer);
      })
    );
  }
  
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }
  
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${customer.customerId}`, customer);
  }
  
  getCustomerOrders(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${customerId}/orders`);
  }
  
  getCustomerStatistics(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${customerId}/statistics`);
  }
}