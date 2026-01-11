export class InviteCode {
  private readonly value: string;
  private readonly expiresAt: Date;

  private constructor(code: string, expiresAt: Date) {
    this.value = code;
    this.expiresAt = expiresAt;
  }

  static generate(): InviteCode {
    const code = this.generateRandomCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return new InviteCode(code, expiresAt);
  }

  static fromExisting(code: string, expiresAt: Date): InviteCode {
    return new InviteCode(code, expiresAt);
  }

  private static generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  getValue(): string {
    return this.value;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired();
  }
}
