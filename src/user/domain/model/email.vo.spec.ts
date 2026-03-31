import { Email } from './email.vo';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = Email.from('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for invalid email', () => {
    expect(() => Email.from('invalid-email')).toThrow();
  });
});
