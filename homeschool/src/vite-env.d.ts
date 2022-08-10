/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module 'mitt'

declare interface ApiConfig {
  host?: string;
  debug: boolean;
  develop: boolean;
  mock?: boolean;
  mockhost?: string;
}

interface Window {
  [propName: string]: any;
}
