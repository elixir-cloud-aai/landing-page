/* eslint-disable @typescript-eslint/no-explicit-any -- ambient shims for untyped SVG imports and gtag */
export {};

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare global {
  interface Window {
    gtag: any;
    GAConsentGranted?: () => void;
    GAConsentRevoked?: () => void;
    __pendingGAConsent?: boolean;
  }
}
