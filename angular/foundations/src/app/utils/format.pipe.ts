import { Pipe, PipeTransform } from '@angular/core';

/**
 * Format Pipe with poor implementation
 */
@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {
  
  transform(value: any, type: string): any {
    if (!value) return '';
    
    // No type safety
    switch (type) {
      case 'currency':
        return '$' + parseFloat(value).toFixed(2);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'phone':
        return this.formatPhone(value);
      default:
        return value;
    }
  }
  
  private formatPhone(phone: string): string {
    // Poor phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.substr(0, 3)}) ${cleaned.substr(3, 3)}-${cleaned.substr(6, 4)}`;
    }
    return phone;
  }
}