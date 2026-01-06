import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <h1>Legacy Order Management System</h1>
      <p>⚠️ This application contains intentionally problematic code for training purposes</p>
      
      <div class="main-content">
        <app-order-list></app-order-list>
        <app-customer-detail></app-customer-detail>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .main-content {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    h1 {
      color: #333;
    }
    p {
      background: #fff3cd;
      padding: 10px;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
    }
  `]
})
export class AppComponent {
  title = 'copilot-foundations-lab1-angular';
}