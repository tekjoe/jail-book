import { ElementHandle, Page } from 'puppeteer';

declare module 'puppeteer' {
  interface Page {
    $x(expression: string): Promise<ElementHandle[]>;
  }
} 