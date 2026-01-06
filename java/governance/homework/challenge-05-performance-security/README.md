# Challenge 5: Performance vs Security Tradeoffs

**Difficulty:** 5/5  
**Estimated Time:** 2-3 hours  
**Points:** 20 (+ 5 bonus)

---

## Scenario

Optimize a secure application without compromising security. The current implementation has performance issues, but naive optimizations introduce vulnerabilities.

**Challenges:**
- Optimize authentication without enabling timing attacks
- Implement caching without data leakage
- Speed up crypto operations securely
- Balance security headers with performance
- Implement secure lazy loading

---

## Vulnerable Code

```typescript
// auth-check.service.ts - VULNERABLE TO TIMING ATTACKS
@Injectable()
export class AuthCheckService {
  
  validatePassword(input: string, hash: string): boolean {
    // VULNERABILITY: Timing attack - comparison time reveals info
    return input === hash;
  }
  
  validateToken(token: string): boolean {
    // VULNERABILITY: Early return on mismatch
    const expected = this.getExpectedToken();
    for (let i = 0; i < token.length; i++) {
      if (token[i] !== expected[i]) {
        return false; // Timing leak!
      }
    }
    return true;
  }
}

// cache.service.ts - VULNERABLE TO CACHE POISONING
@Injectable()
export class CacheService {
  private cache = new Map<string, any>();
  
  getCached(key: string): any {
    // VULNERABILITY: No user isolation in cache key
    return this.cache.get(key);
  }
  
  setCached(key: string, value: any): void {
    // VULNERABILITY: No TTL, no size limit
    this.cache.set(key, value);
  }
  
  // VULNERABILITY: Caching authenticated responses
  @Cacheable()
  getUser(id: string): Observable<User> {
    return this.http.get(`/api/user/${id}`);
  }
}

// crypto.service.ts - VULNERABLE OPTIMIZATIONS
@Injectable()
export class CryptoService {
  
  hash(data: string): string {
    // VULNERABILITY: Weak, fast hash for "performance"
    return btoa(data); // Just base64, not hashing!
  }
  
  encrypt(data: string, key: string): string {
    // VULNERABILITY: Weak cipher for "speed"
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
}

// rate-limiter.service.ts - VULNERABLE TO DOS
@Injectable()
export class RateLimiterService {
  private requestCounts = new Map<string, number>();
  
  checkLimit(ip: string): boolean {
    // VULNERABILITY: Memory leak - never clears old IPs
    const count = this.requestCounts.get(ip) || 0;
    this.requestCounts.set(ip, count + 1);
    return count < 100;
  }
}
```

---

## Attack Scenarios

### Attack 1: Timing Attack on Authentication
```typescript
// Measure response time to deduce password
const start = performance.now();
await checkPassword(guess);
const time = performance.now() - start;
// Longer time = more characters correct
```

### Attack 2: Cache Poisoning
```typescript
// Attacker sets cache with malicious data
GET /api/user/123  // Admin user
// Cache stores with key "123" (no user isolation)
GET /api/user/123  // Victim gets admin data from cache
```

### Attack 3: Resource Exhaustion
```typescript
// Flood with unique IPs to fill memory
for(let i = 0; i < 1000000; i++) {
  rateLimiter.checkLimit(`192.168.${i % 255}.${i % 255}`);
}
// Memory leak in requestCounts Map
```

---

## Your Tasks

### Task 1: Identify Issues (4 pts)

1. **Timing Attacks**
   - String comparison timing leaks
   - Early return patterns
   - Crypto operation timing

2. **Cache Vulnerabilities**
   - Missing user isolation
   - No TTL/expiration
   - Sensitive data caching
   - Cache poisoning vectors

3. **Performance/Security Tradeoffs**
   - Weak crypto for speed
   - Missing rate limiting
   - Resource exhaustion

### Task 2: Implement Secure Optimizations (8 pts)

1. **Constant-Time Operations**
   ```typescript
   // Use crypto.timingSafeEqual
   import { timingSafeEqual } from 'crypto';
   
   validateToken(token: string, expected: string): boolean {
     const a = Buffer.from(token);
     const b = Buffer.from(expected);
     return a.length === b.length && timingSafeEqual(a, b);
   }
   ```

2. **Secure Caching**
   ```typescript
   class SecureCache {
     private cache = new Map<string, CacheEntry>();
     
     get(userId: string, key: string): any {
       // Include userId in cache key
       const fullKey = `${userId}:${key}`;
       const entry = this.cache.get(fullKey);
       
       // Check TTL
       if (entry && Date.now() < entry.expiresAt) {
         return entry.value;
       }
       return null;
     }
   }
   ```

3. **Proper Cryptography**
   ```typescript
   import { pbkdf2, randomBytes, createCipheriv } from 'crypto';
   
   async hashPassword(password: string): Promise<string> {
     const salt = randomBytes(16);
     const hash = await pbkdf2(password, salt, 100000, 64, 'sha512');
     return `${salt.toString('hex')}:${hash.toString('hex')}`;
   }
   ```

4. **Adaptive Rate Limiting**
   ```typescript
   class AdaptiveRateLimiter {
     private limits = new Map<string, RateLimit>();
     
     check(key: string): boolean {
       // Use sliding window
       // Implement exponential backoff
       // Clear expired entries
     }
   }
   ```

5. **Security Headers with Caching**
   ```typescript
   // Balance security and performance
   res.setHeader('Cache-Control', 'private, max-age=300');
   res.setHeader('Vary', 'Authorization'); // Prevent cache poisoning
   ```

### Task 3: Performance Tests (4 pts)
```typescript
it('should use constant-time comparison');
it('should isolate cache by user');
it('should use proper crypto (pbkdf2/bcrypt)');
it('should implement rate limiting with cleanup');
it('should set appropriate cache headers');
```

---

## Bonus (5 pts)

1. **Constant-Time String Comparison (2 pts)**
   ```typescript
   function timingSafeCompare(a: string, b: string): boolean {
     let mismatch = a.length === b.length ? 0 : 1;
     for (let i = 0; i < a.length; i++) {
       mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
     }
     return mismatch === 0;
   }
   ```

2. **Cache Poisoning Defense (1 pt)**
   - Implement cache key signing
   - Add Vary headers

3. **Adaptive Rate Limiting (1 pt)**
   - Implement GCRA algorithm
   - Add distributed rate limiting

4. **Performance Regression Tests (1 pt)**
   ```typescript
   it('should hash password in < 1 second');
   it('should handle 1000 req/s with rate limiting');
   ```

---

## Checklist

- [ ] No timing attack vulnerabilities
- [ ] Constant-time comparisons for secrets
- [ ] Proper crypto (bcrypt/pbkdf2/scrypt)
- [ ] User-isolated caching
- [ ] TTL on all cached data
- [ ] Rate limiting with cleanup
- [ ] Secure lazy loading
- [ ] Performance benchmarks passing
- [ ] No sensitive data in public caches

---

## Testing

```bash
# Run performance tests
npm run test:performance

# Benchmark crypto operations
node benchmark-crypto.js

# Test timing attacks
node test-timing.js

# Load testing
artillery run load-test.yml
```

---

## Resources

- [Timing Attacks Explained](https://codahale.com/a-lesson-in-timing-attacks/)
- [OWASP Caching Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [Rate Limiting Algorithms](https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/)

**Balance is key - never sacrifice security for performance!** 
