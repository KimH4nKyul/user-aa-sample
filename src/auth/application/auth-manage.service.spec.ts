import { Test, TestingModule } from '@nestjs/testing';
import { LoginService, ValidateTokenService } from './auth-manage.service';
import { InMemoryAuthUserRepository } from '../infrastructure/database/in-memory-auth-user.repository';
import { AuthUser } from '../domain/model/auth-user.entity';
import { Email } from '../domain/model/email.vo';
import { UserRole } from '../../shared/types/user-role.enum';
import type { AuthEventPublisher } from '../domain/repository/auth-event.publisher';
import type { PasswordHasher } from '../domain/repository/password-hasher';
import type { TokenProvider } from '../domain/repository/token-provider';

describe('AuthManageService (Login)', () => {
  let loginService: LoginService;
  let validateService: ValidateTokenService;
  let repository: InMemoryAuthUserRepository;
  let publishUserLoggedIn: jest.Mock;
  let compare: jest.Mock;
  let validate: jest.Mock;
  let tokenProvider: jest.Mocked<TokenProvider>;

  beforeEach(async () => {
    publishUserLoggedIn = jest.fn().mockResolvedValue(undefined);
    const publisher = {
      publishUserJoinRequested: jest.fn(),
      publishUserLoggedIn,
    } as jest.Mocked<AuthEventPublisher>;

    compare = jest
      .fn()
      .mockImplementation((p: string, h: string) =>
        Promise.resolve(h === `hashed_${p}`),
      );
    const hasher = {
      hash: jest.fn(),
      compare,
    } as jest.Mocked<PasswordHasher>;

    validate = jest
      .fn()
      .mockResolvedValue({ sub: 'uuid-1', role: UserRole.USER });
    tokenProvider = {
      issue: jest.fn().mockResolvedValue('token_val'),
      validate,
    } as jest.Mocked<TokenProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        ValidateTokenService,
        {
          provide: 'AuthUserRepository',
          useClass: InMemoryAuthUserRepository,
        },
        {
          provide: 'AuthEventPublisher',
          useValue: publisher,
        },
        {
          provide: 'PasswordHasher',
          useValue: hasher,
        },
        {
          provide: 'TokenProvider',
          useValue: tokenProvider,
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    validateService = module.get<ValidateTokenService>(ValidateTokenService);
    repository = module.get<InMemoryAuthUserRepository>('AuthUserRepository');
  });

  describe('LoginService', () => {
    it('[TC-AUTH-002] should login successfully and return token', async () => {
      const email = 'login@example.com';
      const password = 'password123';
      const authUser = AuthUser.create(
        'uuid-1',
        Email.from(email),
        'hashed_password123',
        UserRole.USER,
      );
      await repository.save(authUser);

      const token = await loginService.execute(email, password);

      expect(token).toBe('token_val');
      expect(publishUserLoggedIn).toHaveBeenCalledWith(authUser);
    });

    it('[TC-AUTH-003] should throw error for invalid password', async () => {
      const email = 'login@example.com';
      const password = 'wrong_password';
      const authUser = AuthUser.create(
        'uuid-1',
        Email.from(email),
        'hashed_password123',
        UserRole.USER,
      );
      await repository.save(authUser);

      await expect(loginService.execute(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(publishUserLoggedIn).not.toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      const email = 'non-existent@example.com';
      const password = 'password123';

      await expect(loginService.execute(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('ValidateTokenService', () => {
    it('should validate token and return payload', async () => {
      const token = 'token_val';
      const result = await validateService.execute(token);

      expect(result).toEqual({ sub: 'uuid-1', role: UserRole.USER });
      expect(validate).toHaveBeenCalledWith(token);
    });
  });
});
