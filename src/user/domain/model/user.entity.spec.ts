import { User } from './user.entity';
import { Email } from './email.vo';
import { UserStatus } from '../types/user-status.enum';
import { UserRole } from '../../../shared/types/user-role.enum';

describe('User', () => {
  it('should create a new user with PENDING status and USER role by default', () => {
    const email = Email.from('test@example.com');
    const user = User.create('uuid', email);
    expect(user.getStatus()).toBe(UserStatus.PENDING);
    expect(user.getRole()).toBe(UserRole.USER);
  });

  it('should create a new user with specific role', () => {
    const email = Email.from('test@example.com');
    const user = User.create('uuid', email, UserRole.ADMIN);
    expect(user.getRole()).toBe(UserRole.ADMIN);
  });

  it('should activate a pending user', () => {
    const email = Email.from('test@example.com');
    const user = User.create('uuid', email);
    user.activate();
    expect(user.getStatus()).toBe(UserStatus.ACTIVE);
  });

  it('should deactivate an active user', () => {
    const email = Email.from('test@example.com');
    const user = User.create('uuid', email);
    user.activate();
    user.deactivate();
    expect(user.getStatus()).toBe(UserStatus.INACTIVE);
  });
});
