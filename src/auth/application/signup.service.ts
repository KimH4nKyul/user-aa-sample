import { Injectable, Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../domain/repository/auth-user.repository';
import type { AuthEventPublisher } from '../domain/repository/auth-event.publisher';
import type { PasswordHasher } from '../domain/repository/password-hasher';
import { AuthUser } from '../domain/model/auth-user.entity';
import { Email } from '../domain/model/email.vo';
import { UserRole } from '../../shared/types/user-role.enum';

@Injectable()
export class SignupService {
  constructor(
    @Inject('AuthUserRepository')
    private readonly authUserRepository: AuthUserRepository,
    @Inject('AuthEventPublisher')
    private readonly authEventPublisher: AuthEventPublisher,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async execute(emailStr: string, password: string, role: UserRole = UserRole.USER): Promise<AuthUser> {
    const email = Email.from(emailStr);

    // 1. Check uniqueness
    const exists = await this.authUserRepository.existsByEmail(email);
    if (exists) {
      throw new Error(`User already exists: ${emailStr}`);
    }

    // 2. Hash password
    const passwordHash = await this.passwordHasher.hash(password);

    // 3. Create AuthUser
    const id = crypto.randomUUID();
    const authUser = AuthUser.create(id, email, passwordHash, role);

    // 4. Save AuthUser
    await this.authUserRepository.save(authUser);

    // 5. Emit UserJoinRequested event
    await this.authEventPublisher.publishUserJoinRequested(authUser);

    return authUser;
  }
}
