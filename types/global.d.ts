
export {};

declare global {
  interface Window {
    updateOrderHistory?: () => void;
  }
}
