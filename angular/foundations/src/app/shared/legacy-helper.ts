/**
 * Legacy Helper - Utility anti-patterns
 * 
 * Issues:
 * - Global functions polluting namespace
 * - Prototype modifications
 * - Synchronous HTTP calls (XMLHttpRequest)
 * - Browser-specific code without checks
 * - Regular expressions with catastrophic backtracking
 * - Recursive functions without base cases
 */

// Global functions - anti-pattern
(window as any).legacyHelper = {
  formatDate: function(date: any): string {
    // Poor date formatting
    if (!date) return '';
    return new Date(date).toString();
  },
  
  validateInput: function(input: any): boolean {
    // No validation logic
    return true;
  }
};

// Prototype modification - anti-pattern
declare global {
  interface String {
    legacyTrim(): string;
    legacyReverse(): string;
  }
  
  interface Array<T> {
    legacyFind(predicate: (item: T) => boolean): T | undefined;
  }
}

String.prototype.legacyTrim = function(): string {
  return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.legacyReverse = function(): string {
  return this.split('').reverse().join('');
};

Array.prototype.legacyFind = function<T>(predicate: (item: T) => boolean): T | undefined {
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      return this[i];
    }
  }
  return undefined;
};

// Synchronous HTTP helper
export function syncHttpRequest(url: string): any {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // Synchronous
  xhr.send();
  
  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
  throw new Error('Request failed');
}

// Regex with potential catastrophic backtracking
export function validateComplexPattern(input: string): boolean {
  const pattern = /^(a+)+b$/; // Potentially catastrophic
  return pattern.test(input);
}

// Recursive function without proper base case
export function recursiveProcessor(data: any, depth: number = 0): any {
  if (depth > 1000) return data; // Weak base case
  
  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const key in data) {
      result[key] = recursiveProcessor(data[key], depth + 1);
    }
    return result;
  }
  
  return data;
}

// Browser-specific code without feature detection
export function getBrowserInfo(): any {
  // Direct browser property access
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    // Deprecated properties
    appName: (navigator as any).appName,
    appVersion: (navigator as any).appVersion
  };
}

// Memory leak - creates closures that retain references
export function createLeakyFunction(): Function {
  const largeData = new Array(1000000).fill('memory leak');
  
  return function() {
    console.log('Function called, still retaining:', largeData.length, 'items');
    return largeData[0];
  };
}

// Poor error handling
export function riskyOperation(callback: Function): void {
  try {
    const result = callback();
    // No validation of result
  } catch (error) {
    // Silent failure
  }
}