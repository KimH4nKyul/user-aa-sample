import { User } from '../model/user.entity';
import { Email } from '../model/email.vo';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  findById(id: string): Promise<User | null>;
}
