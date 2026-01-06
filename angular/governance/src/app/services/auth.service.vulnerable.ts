import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) {}
  
  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/login', { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          localStorage.setItem('pwd', btoa(password));
          
          console.log('Login successful:', username, password);
        })
      );
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  hasRole(role: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles?.includes(role);
  }
  
  logout(): void {
    localStorage.removeItem('token');
  }
  
  updateProfile(data: any): Observable<any> {
    return this.http.put('/api/profile', data);
  }
}
