import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user.repository';
import { User } from '../../domain/model/user.entity';
import { Email } from '../../domain/model/email.vo';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().equals(email)) {
        return user;
      }
    }
    return null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }
}
