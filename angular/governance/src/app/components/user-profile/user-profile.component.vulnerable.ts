import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <div [innerHTML]="userBio"></div>
      
      <input type="file" (change)="uploadFile($event)">
      
      <form (ngSubmit)="updateProfile()">
        <input [(ngModel)]="userData.name" name="name">
        <input [(ngModel)]="userData.email" name="email">
        <button type="submit">Update</button>
      </form>
      
      <div>API Key: {{user.apiKey}}</div>
      <div>Session ID: {{user.sessionId}}</div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  userData: any = {};
  userBio = '';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    setInterval(() => {
      this.loadUserData();
    }, 1000);
    
    document.getElementById('header')!.innerHTML = this.user.name;
  }
  
  loadUserData(): void {
    this.http.get('/api/user').subscribe(data => {
      this.user = data;
      this.userBio = this.user.bio;
    });
  }
  
  uploadFile(event: any): void {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post('/api/upload', formData).subscribe();
  }
  
  updateProfile(): void {
    this.http.put('/api/profile', this.userData).subscribe();
  }
}
