import { Injectable } from '@nestjs/common';
import type { AuthUserRepository } from '../../domain/repository/auth-user.repository';
import { AuthUser } from '../../domain/model/auth-user.entity';
import { Email } from '../../domain/model/email.vo';

@Injectable()
export class InMemoryAuthUserRepository implements AuthUserRepository {
  private readonly users: Map<string, AuthUser> = new Map();

  findByEmail(email: Email): Promise<AuthUser | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  }

  save(authUser: AuthUser): Promise<void> {
    this.users.set(authUser.getId(), authUser);
    return Promise.resolve();
  }

  existsByEmail(email: Email): Promise<boolean> {
    const user = Array.from(this.users.values()).find((u) =>
      u.getEmail().equals(email),
    );
    return Promise.resolve(!!user);
  }
}
