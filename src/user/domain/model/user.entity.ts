import { Email } from './email.vo';
import { UserStatus } from '../types/user-status.enum';
import { UserRole } from '../../../shared/types/user-role.enum';

export class User {
  private constructor(
    private readonly id: string,
    private readonly email: Email,
    private status: UserStatus,
    private readonly role: UserRole,
    private readonly createdAt: Date,
  ) {}

  public static create(
    id: string,
    email: Email,
    role: UserRole = UserRole.USER,
  ): User {
    return new User(id, email, UserStatus.PENDING, role, new Date());
  }

  public static rehydrate(
    id: string,
    email: Email,
    status: UserStatus,
    role: UserRole,
    createdAt: Date,
  ): User {
    return new User(id, email, status, role, createdAt);
  }

  public activate(): void {
    if (this.status !== UserStatus.PENDING) {
      throw new Error(`Cannot activate user in ${this.status} status`);
    }
    this.status = UserStatus.ACTIVE;
  }

  public deactivate(): void {
    if (this.status !== UserStatus.ACTIVE) {
      throw new Error(`Cannot deactivate user in ${this.status} status`);
    }
    this.status = UserStatus.INACTIVE;
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getStatus(): UserStatus {
    return this.status;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
