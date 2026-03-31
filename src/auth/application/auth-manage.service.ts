import { Injectable, Inject } from '@nestjs/common';
import type { AuthUserRepository } from '../domain/repository/auth-user.repository';
import type { AuthEventPublisher } from '../domain/repository/auth-event.publisher';
import type { PasswordHasher } from '../domain/repository/password-hasher';
import type { TokenProvider } from '../domain/repository/token-provider';
import { Email } from '../domain/model/email.vo';

@Injectable()
export class LoginService {
  constructor(
    @Inject('AuthUserRepository')
    private readonly authUserRepository: AuthUserRepository,
    @Inject('AuthEventPublisher')
    private readonly authEventPublisher: AuthEventPublisher,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
    @Inject('TokenProvider')
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async execute(emailStr: string, password: string): Promise<string> {
    const email = Email.from(emailStr);

    // 1. Find AuthUser
    const authUser = await this.authUserRepository.findByEmail(email);
    if (!authUser) {
      throw new Error('Invalid credentials');
    }

    // 2. Verify password
    const isValid = await this.passwordHasher.compare(
      password,
      authUser.getPasswordHash(),
    );
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // 3. Issue token
    const token = await this.tokenProvider.issue({
      sub: authUser.getId(),
      email: authUser.getEmail().getValue(),
      role: authUser.getRole(),
    });

    // 4. Emit UserLoggedIn event
    await this.authEventPublisher.publishUserLoggedIn(authUser);

    return token;
  }
}

@Injectable()
export class ValidateTokenService {
  constructor(
    @Inject('TokenProvider')
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async execute(token: string): Promise<unknown> {
    return this.tokenProvider.validate(token);
  }
}
