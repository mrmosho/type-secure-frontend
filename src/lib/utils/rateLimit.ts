export class RateLimiter {
  private attempts: number;
  private lastAttempt: number;
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.attempts = 0;
    this.lastAttempt = 0;
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  canAttempt(): boolean {
    const now = Date.now();
    
    if (now - this.lastAttempt >= this.timeWindow) {
      this.attempts = 0;
    }

    if (this.attempts >= this.maxAttempts) {
      return false;
    }

    this.attempts++;
    this.lastAttempt = now;
    return true;
  }

  getRemainingTime(): number {
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastAttempt;
    
    if (timeSinceLastAttempt >= this.timeWindow) {
      return 0;
    }

    return Math.ceil((this.timeWindow - timeSinceLastAttempt) / 1000);
  }

  reset(): void {
    this.attempts = 0;
    this.lastAttempt = 0;
  }
}