import { AuthUser } from '../model/auth-user.entity';
import { Email } from '../model/email.vo';

export interface AuthUserRepository {
  findByEmail(email: Email): Promise<AuthUser | null>;
  save(authUser: AuthUser): Promise<void>;
  existsByEmail(email: Email): Promise<boolean>;
}
