import { Injectable } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repository/auth-user.repository';
import { AuthUser } from '../../domain/model/auth-user.entity';
import { Email } from '../../domain/model/email.vo';

@Injectable()
export class InMemoryAuthUserRepository implements AuthUserRepository {
  private readonly users: Map<string, AuthUser> = new Map();

  async findByEmail(email: Email): Promise<AuthUser | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return user;
      }
    }
    return null;
  }

  async save(authUser: AuthUser): Promise<void> {
    this.users.set(authUser.getId(), authUser);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
