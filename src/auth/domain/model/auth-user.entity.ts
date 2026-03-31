import { Email } from './email.vo';
import { AuthUserStatus } from '../types/auth-user-status.enum';
import { UserRole } from '../../../shared/types/user-role.enum';

export class AuthUser {
  private constructor(
    private readonly id: string,
    private readonly email: Email,
    private readonly passwordHash: string,
    private status: AuthUserStatus,
    private readonly role: UserRole,
  ) {}

  public static create(
    id: string,
    email: Email,
    passwordHash: string,
    role: UserRole = UserRole.USER,
  ): AuthUser {
    return new AuthUser(id, email, passwordHash, AuthUserStatus.ACTIVE, role);
  }

  public static rehydrate(
    id: string,
    email: Email,
    passwordHash: string,
    status: AuthUserStatus,
    role: UserRole,
  ): AuthUser {
    return new AuthUser(id, email, passwordHash, status, role);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getStatus(): AuthUserStatus {
    return this.status;
  }

  public getRole(): UserRole {
    return this.role;
  }
}
