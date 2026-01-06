import { Injectable } from '@angular/core';

/**
 * Validation Service with poor implementation
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  // Poor email validation
  isValidEmail(email: string): boolean {
    if (!email) return false;
    return email.includes('@') && email.includes('.');
  }
  
  // No phone validation
  isValidPhone(phone: string): boolean {
    return phone && phone.length >= 10;
  }
  
  // Generic validation
  isRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}