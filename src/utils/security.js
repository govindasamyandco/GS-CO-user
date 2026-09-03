/**
 * Govindasamy & Co - Customer Web Security Utilities
 * Includes strict input sanitization against XSS and client-side submission rate limiting.
 */

/**
 * Strips dangerous HTML tags and event handlers to prevent XSS attacks
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Rate limiter for checkout / WhatsApp order requests
 * Prevents automated bots or rapid double-clicking from spamming inquiries
 */
export class ClientRateLimiter {
  constructor(cooldownMs = 3000) {
    this.cooldownMs = cooldownMs;
    this.lastActionTimestamp = 0;
  }

  canProceed() {
    const now = Date.now();
    if (now - this.lastActionTimestamp < this.cooldownMs) {
      const remainingSecs = Math.ceil((this.cooldownMs - (now - this.lastActionTimestamp)) / 1000);
      return { allowed: false, remainingSecs };
    }
    this.lastActionTimestamp = now;
    return { allowed: true, remainingSecs: 0 };
  }
}

export const orderRateLimiter = new ClientRateLimiter(4000);
