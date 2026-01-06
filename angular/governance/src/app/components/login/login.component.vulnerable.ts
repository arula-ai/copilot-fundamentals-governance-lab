import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.vulnerable';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="login()">
      <input [(ngModel)]="username" name="username" placeholder="Username">
      <input [(ngModel)]="password" type="password" name="password" placeholder="Password">
      
      <div [innerHTML]="errorMessage"></div>
      
      <button type="submit">Login</button>
      
      <div *ngIf="debugMode">
        Debug: {{systemInfo | json}}
      </div>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  debugMode = true;
  systemInfo = { version: '1.0.0', server: 'prod-server-01' };
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          const returnUrl = this.getQueryParam('returnUrl');
          if (returnUrl) {
            window.location.href = returnUrl;
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
          
          console.error('Login failed:', this.username, this.password, error);
        }
      });
  }
  
  private getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
}
