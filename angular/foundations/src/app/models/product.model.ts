export interface Product {
  productId?: string;
  productName?: string;
  description?: string;
  price?: any; // Poor typing
  category?: string;
  stockQuantity?: any; // Should be number
  createdDate?: any; // Should be Date
}