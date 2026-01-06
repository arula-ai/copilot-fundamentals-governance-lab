import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../data/customer.service';
import { ValidationService } from '../../utils/validation.service';
import { Customer } from '../../models/customer.model';

/**
 * Customer Detail Component with anti-patterns
 * 
 * Issues:
 * - Form validation in template
 * - No reactive forms
 * - Manual change detection triggers
 * - Deeply nested subscriptions
 * - Component doing routing logic
 * - Direct parent component access
 * - No proper error handling
 * - Mixed concerns (display and editing)
 */
@Component({
  selector: 'app-customer-detail',
  template: `
    <div class="customer-detail">
      <h3>Customer Details</h3>
      
      <!-- Form validation in template - anti-pattern -->
      <form *ngIf="editMode" (ngSubmit)="saveCustomer()" #customerForm="ngForm">
        <div class="form-group">
          <label>Name:</label>
          <input 
            [(ngModel)]="customer.customerName" 
            name="customerName"
            required
            minlength="2"
            maxlength="50"
            #name="ngModel"
            (blur)="validateField('customerName')"
            [class.error]="name.invalid && name.touched"
          />
          <!-- Complex validation in template -->
          <div class="error-message" *ngIf="name.invalid && name.touched">
            <span *ngIf="name.errors?.['required']">Name is required</span>
            <span *ngIf="name.errors?.['minlength']">Name must be at least 2 characters</span>
            <span *ngIf="name.errors?.['maxlength']">Name cannot exceed 50 characters</span>
          </div>
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input 
            [(ngModel)]="customer.email" 
            name="email"
            type="email"
            required
            #email="ngModel"
            (blur)="validateEmail()"
            [class.error]="email.invalid && email.touched || emailValidationError"
          />
          <div class="error-message" *ngIf="email.invalid && email.touched || emailValidationError">
            <span *ngIf="email.errors?.['required']">Email is required</span>
            <span *ngIf="email.errors?.['email'] || emailValidationError">Invalid email format</span>
          </div>
        </div>
        
        <div class="form-group">
          <label>Phone:</label>
          <input 
            [(ngModel)]="customer.phone" 
            name="phone"
            (input)="formatPhoneNumber($event)"
            (blur)="validatePhone()"
            [class.error]="phoneValidationError"
          />
          <div class="error-message" *ngIf="phoneValidationError">
            Invalid phone number format
          </div>
        </div>
        
        <div class="form-group">
          <label>Address:</label>
          <textarea 
            [(ngModel)]="customer.address" 
            name="address"
            rows="3"
            (blur)="validateAddress()"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" [disabled]="customerForm.invalid || isSaving">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
      
      <!-- Display mode with poor structure -->
      <div *ngIf="!editMode && customer" class="customer-display">
        <div class="info-row">
          <strong>ID:</strong> {{ customer.customerId }}
        </div>
        <div class="info-row">
          <strong>Name:</strong> {{ customer.customerName }}
        </div>
        <div class="info-row">
          <strong>Email:</strong> 
          <a [href]="'mailto:' + customer.email">{{ customer.email }}</a>
        </div>
        <div class="info-row">
          <strong>Phone:</strong> {{ formatDisplayPhone(customer.phone) }}
        </div>
        <div class="info-row">
          <strong>Address:</strong> {{ customer.address }}
        </div>
        <div class="info-row">
          <strong>Created:</strong> {{ formatDate(customer.createdDate) }}
        </div>
        
        <button (click)="enterEditMode()">Edit Customer</button>
      </div>
      
      <div *ngIf="!customer && !isLoading">
        <p>No customer selected</p>
        <button (click)="createNewCustomer()">Create New Customer</button>
      </div>
      
      <div *ngIf="isLoading" class="loading">
        Loading customer details...
      </div>
    </div>
  `,
  styles: [`
    .customer-detail {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 500px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: bold;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    .form-group input.error,
    .form-group textarea.error {
      border-color: #ff0000;
      background-color: #fff5f5;
    }
    
    .error-message {
      color: #ff0000;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .form-actions {
      margin-top: 20px;
    }
    
    .form-actions button {
      margin-right: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .form-actions button[type="submit"] {
      background: #007bff;
      color: white;
    }
    
    .form-actions button[type="button"] {
      background: #6c757d;
      color: white;
    }
    
    .info-row {
      margin-bottom: 12px;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  
  customer: Customer | null = null;
  editMode: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  
  // Validation state that should be managed differently
  emailValidationError: boolean = false;
  phoneValidationError: boolean = false;
  validationErrors: any = {};
  
  // Direct service instantiation - anti-pattern
  constructor(
    private http: HttpClient,
    private customerService?: CustomerService,
    private validationService?: ValidationService
  ) {
    // Poor constructor pattern
    if (!this.customerService) {
      this.customerService = new CustomerService(this.http);
    }
    if (!this.validationService) {
      this.validationService = new ValidationService();
    }
  }
  
  ngOnInit(): void {
    this.initializeComponent();
    this.setupEventListeners();
  }
  
  private initializeComponent(): void {
    // Component doing routing logic
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    
    if (customerId) {
      this.loadCustomer(customerId);
    }
    
    // Listen for customer selection from parent
    (window as any).onCustomerSelected = (customer: Customer) => {
      this.customer = customer;
      this.editMode = false;
    };
  }
  
  private setupEventListeners(): void {
    // Direct DOM event listening
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.editMode) {
        this.cancelEdit();
      }
    });
  }
  
  private loadCustomer(customerId: string): void {
    this.isLoading = true;
    
    // Deeply nested subscriptions
    this.customerService!.getCustomer(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.isLoading = false;
        
        // Another nested subscription
        this.customerService!.getCustomerOrders(customerId).subscribe({
          next: (orders) => {
            if (this.customer) {
              this.customer.orders = orders;
              
              // Yet another nested subscription
              this.customerService!.getCustomerStatistics(customerId).subscribe({
                next: (stats) => {
                  // Attach stats to customer object
                  (this.customer as any).statistics = stats;
                },
                error: (error) => {
                  console.error('Failed to load customer statistics:', error);
                }
              });
            }
          },
          error: (error) => {
            console.error('Failed to load customer orders:', error);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        alert('Failed to load customer: ' + error.message);
      }
    });
  }
  
  enterEditMode(): void {
    this.editMode = true;
    this.clearValidationErrors();
    
    // Manual change detection trigger
    setTimeout(() => {
      this.focusFirstInput();
    }, 0);
  }
  
  cancelEdit(): void {
    this.editMode = false;
    this.clearValidationErrors();
    
    // Poor state management - should restore original values
    if (this.customer?.customerId) {
      this.loadCustomer(this.customer.customerId);
    }
  }
  
  saveCustomer(): void {
    if (!this.customer) return;
    
    // Manual validation before save
    if (!this.performFullValidation()) {
      return;
    }
    
    this.isSaving = true;
    
    if (this.customer.customerId) {
      // Update existing customer
      this.customerService!.updateCustomer(this.customer).subscribe({
        next: (updatedCustomer) => {
          this.customer = updatedCustomer;
          this.editMode = false;
          this.isSaving = false;
          alert('Customer updated successfully');
        },
        error: (error) => {
          this.isSaving = false;
          alert('Failed to update customer: ' + error.message);
        }
      });
    } else {
      // Create new customer
      this.customerService!.createCustomer(this.customer).subscribe({
        next: (newCustomer) => {
          this.customer = newCustomer;
          this.editMode = false;
          this.isSaving = false;
          alert('Customer created successfully');
          
          // Update URL without proper routing
          window.history.pushState({}, '', '?customerId=' + newCustomer.customerId);
        },
        error: (error) => {
          this.isSaving = false;
          alert('Failed to create customer: ' + error.message);
        }
      });
    }
  }
  
  createNewCustomer(): void {
    this.customer = {
      customerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    };
    this.editMode = true;
  }
  
  // Field validation methods - should use reactive forms
  validateField(fieldName: string): void {
    if (!this.customer) return;
    
    const value = (this.customer as any)[fieldName];
    
    switch (fieldName) {
      case 'customerName':
        this.validationErrors.customerName = this.validateName(value);
        break;
    }
  }
  
  validateEmail(): void {
    if (!this.customer?.email) {
      this.emailValidationError = false;
      return;
    }
    
    // Using problematic validation service
    this.emailValidationError = !this.validationService!.isValidEmail(this.customer.email);
  }
  
  validatePhone(): void {
    if (!this.customer?.phone) {
      this.phoneValidationError = false;
      return;
    }
    
    // Poor phone validation
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    this.phoneValidationError = !phoneRegex.test(this.customer.phone);
  }
  
  validateAddress(): void {
    // Placeholder for address validation
  }
  
  formatPhoneNumber(event: any): void {
    // Manual phone formatting
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    
    event.target.value = value;
    if (this.customer) {
      this.customer.phone = value;
    }
  }
  
  // Display formatting methods
  formatDisplayPhone(phone: string | undefined): string {
    if (!phone) return 'N/A';
    
    // Poor formatting logic
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.substr(0, 3)}) ${cleaned.substr(3, 3)}-${cleaned.substr(6, 4)}`;
    }
    return phone;
  }
  
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  }
  
  // Private helper methods
  private performFullValidation(): boolean {
    let isValid = true;
    
    if (!this.customer) return false;
    
    // Manual validation of all fields
    if (!this.customer.customerName || this.customer.customerName.trim().length < 2) {
      this.validationErrors.customerName = 'Name must be at least 2 characters';
      isValid = false;
    }
    
    if (!this.customer.email || !this.validationService!.isValidEmail(this.customer.email)) {
      this.emailValidationError = true;
      isValid = false;
    }
    
    if (this.customer.phone) {
      this.validatePhone();
      if (this.phoneValidationError) {
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  private validateName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Name cannot exceed 50 characters';
    }
    return null;
  }
  
  private clearValidationErrors(): void {
    this.emailValidationError = false;
    this.phoneValidationError = false;
    this.validationErrors = {};
  }
  
  private focusFirstInput(): void {
    // Direct DOM manipulation
    const firstInput = document.querySelector('.customer-detail input') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }
}