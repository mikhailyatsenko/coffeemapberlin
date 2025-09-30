export {};

declare global {
  interface Window {
    gtag: (command: 'config' | 'set' | 'event', targetId: string, config?: Record<string, unknown>) => void;
  }
}
