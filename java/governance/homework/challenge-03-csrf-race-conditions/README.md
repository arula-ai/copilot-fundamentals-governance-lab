# Challenge 3: CSRF & Race Conditions

**Difficulty:** 5/5  
**Estimated Time:** 2-3 hours  
**Points:** 20 (+ 5 bonus)

---

## Scenario

You're securing a financial transaction system where users can transfer money between accounts. The system has critical race conditions that allow double-spending and CSRF vulnerabilities that permit unauthorized transactions.

**Security Requirements:**
- Prevent CSRF on all state-changing operations
- Eliminate race conditions in balance checks
- Ensure transactional atomicity
- Implement idempotency for requests
- Prevent TOCTOU (Time-of-check to time-of-use) bugs

---

## Vulnerable Code

```typescript
// transfer.service.ts - VULNERABLE
@Injectable()
export class TransferService {
  
  async transfer(from: string, to: string, amount: number): Promise<void> {
    // VULNERABILITY: Race condition - check and debit not atomic
    const balance = await this.getBalance(from);
    
    if (balance >= amount) {
      // VULNERABILITY: Time gap allows concurrent transfers
      await this.sleep(100); // Simulating network delay
      await this.debit(from, amount);
      await this.credit(to, amount);
    }
  }
  
  async getBalance(account: string): Promise<number> {
    // VULNERABILITY: No locking mechanism
    return this.db.query('SELECT balance FROM accounts WHERE id = ?', [account]);
  }
}

// transfer.component.ts - VULNERABLE
@Component({
  template: `
    <form (ngSubmit)="transfer()">
      <!-- VULNERABILITY: No CSRF token -->
      <input [(ngModel)]="toAccount" name="to"/>
      <input [(ngModel)]="amount" name="amount" type="number"/>
      <button type="submit">Transfer</button>
    </form>
  `
})
export class TransferComponent {
  toAccount = '';
  amount = 0;
  
  transfer(): void {
    // VULNERABILITY: No idempotency key
    this.http.post('/api/transfer', {
      to: this.toAccount,
      amount: this.amount
    }).subscribe();
  }
}
```

---

## Attack Scenarios

### Attack 1: Double-Spending via Race Condition
```typescript
// Attacker sends multiple concurrent requests
Promise.all([
  transfer(account, attacker, 1000),
  transfer(account, attacker, 1000),
  transfer(account, attacker, 1000)
]); // All check balance before any debit occurs
```

### Attack 2: CSRF Attack
```html
<!-- Attacker's malicious website -->
<form action="https://bank.com/api/transfer" method="POST">
  <input name="to" value="attacker-account"/>
  <input name="amount" value="10000"/>
</form>
<script>document.forms[0].submit();</script>
```

### Attack 3: Request Replay
```typescript
// Intercept and replay transfer request multiple times
for(let i = 0; i < 100; i++) {
  fetch('/api/transfer', { method: 'POST', body: interceptedRequest });
}
```

---

## Your Tasks

### Task 1: Identify Vulnerabilities (4 pts)
- Document all CSRF vulnerabilities
- Identify all race conditions
- Find TOCTOU bugs
- Map to OWASP categories

### Task 2: Implement Fixes (8 pts)

1. **CSRF Protection**
   - Implement CSRF tokens (synchronizer pattern)
   - Add SameSite cookie attributes
   - Verify Origin/Referer headers
   - Implement double-submit cookie pattern

2. **Race Condition Prevention**
   - Implement database-level locking (SELECT FOR UPDATE)
   - Use optimistic locking with version numbers
   - Implement pessimistic locking where needed
   - Ensure atomic transactions

3. **Idempotency**
   - Generate unique request IDs
   - Store processed request IDs
   - Return cached responses for duplicates
   - Implement idempotency keys

4. **Transaction Isolation**
   - Use SERIALIZABLE isolation level
   - Implement saga pattern for complex transactions
   - Add distributed locks if needed

### Task 3: Security Tests (4 pts)
```typescript
it('should prevent double-spending via concurrent requests');
it('should require CSRF token for transfers');
it('should handle request replay with idempotency');
it('should prevent TOCTOU in balance checks');
```

---

## Bonus (5 pts)

- **Distributed Locking (2 pts)**: Implement Redis-based locks
- **Saga Pattern (2 pts)**: Implement compensating transactions
- **Formal Proof (1 pt)**: Mathematically prove idempotency

---

## Resources

- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Database Locking Strategies](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Idempotency Patterns](https://stripe.com/docs/api/idempotent_requests)

**This challenge requires deep understanding of concurrency!** 
