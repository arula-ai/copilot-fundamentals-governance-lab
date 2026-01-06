import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * API Client Service with anti-patterns
 * 
 * Issues:
 * - No request interceptors
 * - Hardcoded URLs
 * - No authentication handling
 * - Synchronous operations that should be async
 * - Browser-specific code without checks
 */
@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  
  private baseUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}
  
  // Synchronous HTTP calls using XMLHttpRequest - anti-pattern
  syncGet(endpoint: string): any {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.baseUrl + endpoint, false); // Synchronous
    xhr.send();
    
    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    }
    throw new Error('Request failed');
  }
  
  // No error handling
  get(endpoint: string): Observable<any> {
    return this.http.get(this.baseUrl + endpoint);
  }
  
  // Manual URL construction
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(this.baseUrl + endpoint, data);
  }
}