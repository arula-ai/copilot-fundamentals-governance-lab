import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

type RequireContext = {
  keys(): string[];
  <T>(id: string): T;
};

declare const require: {
  (path: string): unknown;
  context?: (path: string, deep?: boolean, filter?: RegExp) => RequireContext;
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

const loadSpecs = (): void => {
  if (typeof require.context === 'function') {
    const context = require.context('./', true, /\.spec\.ts$/);
    context.keys().forEach(context);
    return;
  }

  // Webpack's require.context is unavailable with the current module format; load specs explicitly instead.
  require('./tests/utils/date-helper.service.spec.ts');
};

loadSpecs();
