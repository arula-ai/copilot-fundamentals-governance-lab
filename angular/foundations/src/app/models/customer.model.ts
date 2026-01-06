// Customer model with minimal typing
export interface Customer {
  customerId?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdDate?: Date | string;
  lastModifiedDate?: Date | string;
  orders?: Order[];
}

// Circular import issue
import { Order } from './order.model';