// Order model with type issues
export interface Order {
  orderId?: string;
  customerId?: string;
  customer?: any; // Should be Customer type
  orderDate?: any; // Could be string or Date
  status?: string;
  totalAmount?: any; // Should be number
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdBy?: string;
  createdDate?: any;
  lastModifiedBy?: string;
  lastModifiedDate?: any;
  
  // Computed properties that should be methods
  canCancel?: boolean;
  canReturn?: boolean;
  canReview?: boolean;
}