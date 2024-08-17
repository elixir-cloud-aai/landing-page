export {};

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare global {
  interface Window {
    gtag: any;
    GAConsentGranted: any;
  }
}
