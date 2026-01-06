import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';

/**
 * Date Helper Service - Legacy implementation with multiple issues
 * WARNING: Contains intentional anti-patterns for training purposes
 * 
 * Issues include:
 * - 400+ lines of code in single service
 * - Memory leaks from unsubscribed observables
 * - Direct DOM manipulation
 * - Callback hell instead of promises/observables
 * - Global state mutations
 * - No type safety (lots of 'any' types)
 * - String-based date manipulation
 * - Side effects in pure functions
 * 
 * Last updated: 2019-08-15
 * TODO: Migrate to modern Angular patterns
 * TODO: Fix memory leaks
 * TODO: Add proper typing
 */
@Injectable({
  providedIn: 'root'
})
export class DateHelperService {
  
  // Global state - anti-pattern
  private globalDateState: any = {};
  private dateChangeSubject = new BehaviorSubject<any>(null);
  private subscriptions: Subscription[] = []; // Never cleaned up properly
  
  // Direct DOM references - should not be in service
  private dateElements: any[] = [];
  
  // Hardcoded configuration
  private readonly DEFAULT_FORMATS = [
    'MM/dd/yyyy',
    'dd/MM/yyyy', 
    'yyyy-MM-dd',
    'MM-dd-yyyy',
    'dd.MM.yyyy',
    'yyyy/MM/dd',
    'M/d/yy',
    'MMM dd, yyyy',
    'MMMM d, yyyy',
    'EEE, MMM dd, yyyy'
  ];
  
  constructor() {
    // Memory leak - subscription never unsubscribed
    this.dateChangeSubject.subscribe((date: any) => {
      this.updateGlobalDateState(date);
      this.manipulateDomElements(date);
    });
    
    // Another memory leak
    this.initializeDateWatchers();
  }
  
  /**
   * Calculate business days - No type safety, everything is 'any'
   * Complex nested logic with side effects
   */
  calculateBusinessDays(start: any, end: any): number {
    if (!start || !end) {
      // Side effect in calculation method
      this.logError('Invalid date inputs', start, end);
      return -1;
    }
    
    // String manipulation instead of proper date handling
    let startStr = this.convertToString(start);
    let endStr = this.convertToString(end);
    
    // Complex nested callbacks
    this.validateDateRangeCallback(startStr, endStr, (isValid: any) => {
      if (isValid) {
        this.processDateCalculation(startStr, endStr, (result: any) => {
          this.updateGlobalDateState({
            lastCalculation: result,
            timestamp: new Date().toISOString()
          });
        });
      } else {
        this.handleValidationError(startStr, endStr, (error: any) => {
          this.globalDateState.lastError = error;
          // Direct DOM manipulation in service
          this.highlightErrorElements();
        });
      }
    });
    
    // Synchronous return while doing async operations above
    let count = 0;
    let current = new Date(startStr);
    let endDate = new Date(endStr);
    
    // Poor date iteration
    while (current < endDate) {
      let dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
        // Hardcoded holiday check
        if (!this.isHardcodedHoliday(current)) {
          count++;
        }
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }
  
  /**
   * Format date for API - Returns different types, no type safety
   */
  formatDateForAPI(date: any, format?: any): any {
    if (!date) return null;
    
    // Multiple return types - anti-pattern
    if (typeof date === 'string') {
      if (format === 'iso') {
        return this.convertStringToIsoDate(date);
      } else if (format === 'timestamp') {
        return new Date(date).getTime();
      } else if (format === 'object') {
        return this.createDateObject(date);
      } else {
        return date; // Return as-is
      }
    } else if (date instanceof Date) {
      if (format === 'string') {
        return date.toISOString();
      } else if (format === 'timestamp') {
        return date.getTime();
      } else {
        return date;
      }
    } else if (typeof date === 'number') {
      let dateObj = new Date(date);
      if (format === 'string') {
        return dateObj.toISOString();
      } else {
        return dateObj;
      }
    } else {
      // Fallback - very unpredictable
      return this.attemptDateConversion(date, format);
    }
  }
  
  /**
   * Validate date range - Complex nested logic, 100+ lines
   */
  validateDateRange(dates: any[]): boolean {
    if (!dates || !Array.isArray(dates)) {
      this.globalDateState.validationErrors = ['Invalid input format'];
      return false;
    }
    
    // Complex validation with side effects
    let isValid = true;
    let errors: any[] = [];
    
    for (let i = 0; i < dates.length; i++) {
      let date = dates[i];
      
      if (typeof date === 'string') {
        if (date.length < 8) {
          errors.push(`Date ${i} too short`);
          isValid = false;
        } else if (date.length > 20) {
          errors.push(`Date ${i} too long`);
          isValid = false;
        } else {
          // Try parsing with multiple formats
          let parsed = false;
          for (let format of this.DEFAULT_FORMATS) {
            try {
              let result = this.parseWithFormat(date, format);
              if (result) {
                parsed = true;
                // Side effect during validation
                this.updateGlobalDateState({
                  [`parsedDate${i}`]: result,
                  [`format${i}`]: format
                });
                break;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
          
          if (!parsed) {
            errors.push(`Date ${i} unparseable`);
            isValid = false;
          }
        }
      } else if (date instanceof Date) {
        if (isNaN(date.getTime())) {
          errors.push(`Date ${i} invalid`);
          isValid = false;
        } else {
          // More side effects
          this.globalDateState[`validDate${i}`] = date;
        }
      } else if (typeof date === 'number') {
        if (date < 0 || date > 8640000000000000) {
          errors.push(`Date ${i} timestamp out of range`);
          isValid = false;
        }
      } else {
        errors.push(`Date ${i} unknown type`);
        isValid = false;
      }
      
      // Cross-validation between dates
      if (i > 0 && isValid) {
        let previousDate = this.convertToComparableDate(dates[i-1]);
        let currentDate = this.convertToComparableDate(date);
        
        if (previousDate && currentDate) {
          if (currentDate < previousDate) {
            errors.push(`Date ${i} before previous date`);
            isValid = false;
          }
          
          let diffDays = this.calculateDaysDifference(previousDate, currentDate);
          if (diffDays > 365) {
            errors.push(`Date ${i} more than year after previous`);
            // Could still be valid, just warning
          }
        }
      }
    }
    
    // Store errors globally
    this.globalDateState.validationErrors = errors;
    this.globalDateState.lastValidation = new Date();
    
    // Trigger side effects
    if (!isValid) {
      this.notifyValidationFailure(errors);
    }
    
    return isValid;
  }
  
  /**
   * Parse user input - 200+ lines with regex hell
   */
  parseUserInput(input: string): Date {
    if (!input || typeof input !== 'string') {
      return null;
    }
    
    let trimmed = input.trim();
    
    // Regex patterns - catastrophic backtracking possible
    let patterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{2,4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/,
      /^(\d{1,2})\s+(\w+)\s+(\d{2,4})$/,
      /^(\w+)\s+(\d{1,2}),?\s+(\d{2,4})$/,
      /^(\w+)\s+(\d{1,2})\w{0,2},?\s+(\d{2,4})$/,
      /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
      /^(\d{2})(\d{2})(\d{2,4})$/,
      /^(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(\d{2,4})$/
    ];
    
    // Try each pattern
    for (let pattern of patterns) {
      let match = trimmed.match(pattern);
      if (match) {
        try {
          let result = this.parseMatchedPattern(match, pattern);
          if (result) {
            // Side effect during parsing
            this.updateParsingHistory(input, result, pattern);
            return result;
          }
        } catch (e) {
          // Continue to next pattern
        }
      }
    }
    
    // Fallback: try natural language parsing
    let naturalDate = this.parseNaturalLanguage(trimmed);
    if (naturalDate) {
      return naturalDate;
    }
    
    // Last resort: attempt various date constructors
    try {
      let directParse = new Date(input);
      if (!isNaN(directParse.getTime())) {
        return directParse;
      }
    } catch (e) {}
    
    try {
      let modifiedInput = this.preprocessDateString(input);
      let secondAttempt = new Date(modifiedInput);
      if (!isNaN(secondAttempt.getTime())) {
        return secondAttempt;
      }
    } catch (e) {}
    
    // Give up
    this.globalDateState.parseFailures = (this.globalDateState.parseFailures || 0) + 1;
    return null;
  }
  
  /**
   * Get relative dates - Returns different types based on context
   */
  getRelativeDates(reference: any): any {
    if (!reference) {
      return null;
    }
    
    let baseDate = this.normalizeToDate(reference);
    if (!baseDate) {
      return false;
    }
    
    let results: any = {};
    
    // Calculate various relative dates
    try {
      results.yesterday = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
      results.tomorrow = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
      results.nextWeek = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      results.lastWeek = new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      results.nextMonth = this.addMonths(baseDate, 1);
      results.lastMonth = this.addMonths(baseDate, -1);
      results.nextYear = new Date(baseDate.getFullYear() + 1, baseDate.getMonth(), baseDate.getDate());
      results.lastYear = new Date(baseDate.getFullYear() - 1, baseDate.getMonth(), baseDate.getDate());
      
      // Weekend calculations
      results.nextMonday = this.findNextDayOfWeek(baseDate, 1);
      results.nextFriday = this.findNextDayOfWeek(baseDate, 5);
      results.lastMonday = this.findPreviousDayOfWeek(baseDate, 1);
      results.lastFriday = this.findPreviousDayOfWeek(baseDate, 5);
      
      // Quarter calculations
      results.quarterStart = this.getQuarterStart(baseDate);
      results.quarterEnd = this.getQuarterEnd(baseDate);
      results.nextQuarterStart = this.getQuarterStart(this.addMonths(baseDate, 3));
      results.lastQuarterStart = this.getQuarterStart(this.addMonths(baseDate, -3));
      
    } catch (e) {
      return 'error';
    }
    
    // Side effect
    this.globalDateState.lastRelativeCalculation = results;
    
    return results;
  }
  
  /**
   * Subscribe to date changes - Creates memory leak
   */
  subscribeToDateChanges(): void {
    // Memory leak - creates subscription but never stores reference for cleanup
    this.dateChangeSubject.pipe(
      debounceTime(300),
      filter(date => date !== null),
      map(date => this.processDateChange(date))
    ).subscribe(processedDate => {
      this.handleDateChange(processedDate);
      
      // Nested subscription - even worse memory leak
      this.dateChangeSubject.pipe(
        map(date => this.validateDate(date))
      ).subscribe(isValid => {
        this.updateValidationState(isValid);
      });
    });
    
    // Another memory leak
    let intervalId = setInterval(() => {
      this.refreshDateState();
    }, 1000);
    
    // intervalId is never cleared!
  }
  
  // Private helper methods with poor implementations
  
  private convertToString(date: any): string {
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'number') return new Date(date).toISOString();
    return String(date);
  }
  
  private validateDateRangeCallback(start: string, end: string, callback: Function): void {
    setTimeout(() => {
      let isValid = new Date(start) < new Date(end);
      callback(isValid);
    }, 100);
  }
  
  private processDateCalculation(start: string, end: string, callback: Function): void {
    setTimeout(() => {
      let result = Math.abs(new Date(end).getTime() - new Date(start).getTime());
      callback(result);
    }, 50);
  }
  
  private handleValidationError(start: string, end: string, callback: Function): void {
    setTimeout(() => {
      callback(`Invalid date range: ${start} to ${end}`);
    }, 25);
  }
  
  private highlightErrorElements(): void {
    // Direct DOM manipulation in service
    this.dateElements.forEach(element => {
      if (element && element.style) {
        element.style.border = '2px solid red';
        element.style.backgroundColor = '#ffebee';
      }
    });
  }
  
  private isHardcodedHoliday(date: Date): boolean {
    let month = date.getMonth();
    let day = date.getDate();
    
    // Hardcoded US holidays
    if (month === 0 && day === 1) return true; // New Year
    if (month === 6 && day === 4) return true; // July 4th
    if (month === 11 && day === 25) return true; // Christmas
    
    return false;
  }
  
  private convertStringToIsoDate(dateStr: string): string {
    try {
      return new Date(dateStr).toISOString();
    } catch (e) {
      return dateStr;
    }
  }
  
  private createDateObject(dateStr: string): any {
    let date = new Date(dateStr);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      timestamp: date.getTime(),
      iso: date.toISOString()
    };
  }
  
  private attemptDateConversion(value: any, format: any): any {
    // Last resort conversion attempt
    try {
      return new Date(value);
    } catch (e) {
      return value;
    }
  }
  
  private parseWithFormat(dateStr: string, format: string): Date | null {
    // Simplified format parsing
    try {
      return new Date(dateStr);
    } catch (e) {
      return null;
    }
  }
  
  private convertToComparableDate(value: any): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    if (typeof value === 'number') return new Date(value);
    return null;
  }
  
  private calculateDaysDifference(date1: Date, date2: Date): number {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
  }
  
  private notifyValidationFailure(errors: any[]): void {
    // Side effect during validation
    console.error('Validation failed:', errors);
    this.globalDateState.notificationCount = (this.globalDateState.notificationCount || 0) + 1;
  }
  
  private parseMatchedPattern(match: RegExpMatchArray, pattern: RegExp): Date | null {
    // Simplified pattern parsing
    try {
      return new Date(match[0]);
    } catch (e) {
      return null;
    }
  }
  
  private updateParsingHistory(input: string, result: Date, pattern: RegExp): void {
    if (!this.globalDateState.parsingHistory) {
      this.globalDateState.parsingHistory = [];
    }
    this.globalDateState.parsingHistory.push({
      input: input,
      result: result,
      pattern: pattern.toString(),
      timestamp: new Date()
    });
  }
  
  private parseNaturalLanguage(input: string): Date | null {
    // Very basic natural language parsing
    if (input.toLowerCase().includes('today')) {
      return new Date();
    }
    if (input.toLowerCase().includes('yesterday')) {
      return new Date(Date.now() - 24 * 60 * 60 * 1000);
    }
    if (input.toLowerCase().includes('tomorrow')) {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    return null;
  }
  
  private preprocessDateString(input: string): string {
    return input.replace(/[^\d\/\-\.]/g, '');
  }
  
  private normalizeToDate(value: any): Date | null {
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch (e) {
      return null;
    }
  }
  
  private addMonths(date: Date, months: number): Date {
    let result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  
  private findNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    let result = new Date(date);
    let days = (dayOfWeek + 7 - result.getDay()) % 7;
    if (days === 0) days = 7;
    result.setDate(result.getDate() + days);
    return result;
  }
  
  private findPreviousDayOfWeek(date: Date, dayOfWeek: number): Date {
    let result = new Date(date);
    let days = (result.getDay() + 7 - dayOfWeek) % 7;
    if (days === 0) days = 7;
    result.setDate(result.getDate() - days);
    return result;
  }
  
  private getQuarterStart(date: Date): Date {
    let quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), quarter * 3, 1);
  }
  
  private getQuarterEnd(date: Date): Date {
    let quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), quarter * 3 + 3, 0);
  }
  
  private processDateChange(date: any): any {
    return {
      date: date,
      timestamp: Date.now(),
      processed: true
    };
  }
  
  private handleDateChange(processedDate: any): void {
    this.globalDateState.lastChange = processedDate;
  }
  
  private validateDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  private updateValidationState(isValid: boolean): void {
    this.globalDateState.isValid = isValid;
  }
  
  private refreshDateState(): void {
    this.globalDateState.lastRefresh = new Date();
  }
  
  private updateGlobalDateState(update: any): void {
    Object.assign(this.globalDateState, update);
  }
  
  private manipulateDomElements(date: any): void {
    // More direct DOM manipulation
    let elements = document.querySelectorAll('.date-field');
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.setAttribute('data-last-update', new Date().toISOString());
      }
    });
  }
  
  private initializeDateWatchers(): void {
    // Memory leak - never cleaned up
    setInterval(() => {
      this.globalDateState.watcherTick = Date.now();
    }, 5000);
  }
  
  private logError(message: string, ...args: any[]): void {
    console.error(message, args);
    this.globalDateState.errorLog = this.globalDateState.errorLog || [];
    this.globalDateState.errorLog.push({
      message: message,
      args: args,
      timestamp: new Date()
    });
  }
}