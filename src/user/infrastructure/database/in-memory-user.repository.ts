import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repository/user.repository';
import { User } from '../../domain/model/user.entity';
import { Email } from '../../domain/model/email.vo';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users: Map<string, User> = new Map();

  save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
    return Promise.resolve();
  }

  findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  }

  existsByEmail(email: Email): Promise<boolean> {
    const user = Array.from(this.users.values()).find((u) =>
      u.getEmail().equals(email),
    );
    return Promise.resolve(!!user);
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) || null);
  }
}
