import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  describe('login', () => {
    it('should store token and user on successful login', (done) => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user']
        }
      };

      service.login('testuser', 'password123').subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(sessionStorage.getItem('auth_token')).toBe('mock-jwt-token');
          expect(service.getCurrentUser()).toEqual(mockResponse.user);
          done();
        }
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
      req.flush(mockResponse);
    });

    it('should handle login error gracefully', (done) => {
      service.login('testuser', 'wrongpassword').subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toBe('Invalid credentials. Please check your username and password.');
          expect(sessionStorage.getItem('auth_token')).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne('/api/login');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle network error', (done) => {
      service.login('testuser', 'password123').subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.message).toBe('Unable to connect to the server. Please check your connection.');
          done();
        }
      });

      const req = httpMock.expectOne('/api/login');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when valid token exists', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `header.${btoa(JSON.stringify({ exp: futureTimestamp }))}.signature`;
      sessionStorage.setItem('auth_token', validToken);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token is expired', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600;
      const expiredToken = `header.${btoa(JSON.stringify({ exp: pastTimestamp }))}.signature`;
      sessionStorage.setItem('auth_token', expiredToken);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false for malformed token', () => {
      sessionStorage.setItem('auth_token', 'malformed-token');
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    beforeEach(() => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user', 'admin']
      };
      service['currentUser'] = mockUser;
    });

    it('should return true when user has the role', () => {
      expect(service.hasRole('admin')).toBe(true);
      expect(service.hasRole('user')).toBe(true);
    });

    it('should return false when user does not have the role', () => {
      expect(service.hasRole('superadmin')).toBe(false);
    });

    it('should return false when no user is logged in', () => {
      service['currentUser'] = null;
      expect(service.hasRole('user')).toBe(false);
    });

    it('should return false when user has no roles', () => {
      service['currentUser'] = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: []
      };
      expect(service.hasRole('user')).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear token and user data', () => {
      sessionStorage.setItem('auth_token', 'mock-token');
      service['currentUser'] = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user']
      };

      service.logout();

      expect(sessionStorage.getItem('auth_token')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should be safe to call multiple times', () => {
      service.logout();
      service.logout();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile and current user', (done) => {
      const updatedUser = {
        id: '123',
        username: 'testuser',
        email: 'newemail@example.com',
        roles: ['user']
      };

      service.updateProfile({ email: 'newemail@example.com' }).subscribe({
        next: (user) => {
          expect(user).toEqual(updatedUser);
          expect(service.getCurrentUser()).toEqual(updatedUser);
          done();
        }
      });

      const req = httpMock.expectOne('/api/profile');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ email: 'newemail@example.com' });
      req.flush(updatedUser);
    });

    it('should handle update error gracefully', (done) => {
      service.updateProfile({ email: 'invalid' }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('An error occurred. Please try again.');
          done();
        }
      });

      const req = httpMock.expectOne('/api/profile');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle forbidden error', (done) => {
      service.updateProfile({ email: 'test@example.com' }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('You do not have permission to perform this action.');
          done();
        }
      });

      const req = httpMock.expectOne('/api/profile');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when logged in', () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user']
      };
      service['currentUser'] = mockUser;

      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when not logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('token management', () => {
    it('should use sessionStorage for token storage', () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user']
        }
      };

      service.login('testuser', 'password').subscribe();
      
      const req = httpMock.expectOne('/api/login');
      req.flush(mockResponse);

      expect(sessionStorage.getItem('auth_token')).toBe('test-token');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should not store password', () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user']
        }
      };

      service.login('testuser', 'secretpassword').subscribe();
      
      const req = httpMock.expectOne('/api/login');
      req.flush(mockResponse);

      expect(sessionStorage.getItem('pwd')).toBeNull();
      expect(localStorage.getItem('pwd')).toBeNull();
      
      const allKeys = Object.keys(sessionStorage);
      allKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        expect(value).not.toContain('secretpassword');
      });
    });
  });
});
