import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { InMemoryAuthUserRepository } from '../infrastructure/database/in-memory-auth-user.repository';
import { UserRole } from '../../shared/types/user-role.enum';
import type { AuthEventPublisher } from '../domain/repository/auth-event.publisher';
import type { PasswordHasher } from '../domain/repository/password-hasher';

describe('SignupService', () => {
  let service: SignupService;
  let repository: InMemoryAuthUserRepository;
  let publishUserJoinRequested: jest.Mock;
  let publisher: jest.Mocked<AuthEventPublisher>;
  let hash: jest.Mock;
  let hasher: jest.Mocked<PasswordHasher>;

  beforeEach(async () => {
    publishUserJoinRequested = jest.fn().mockResolvedValue(undefined);
    publisher = {
      publishUserJoinRequested,
      publishUserLoggedIn: jest.fn(),
    } as jest.Mocked<AuthEventPublisher>;

    hash = jest
      .fn()
      .mockImplementation((p: string) => Promise.resolve(`hashed_${p}`));
    hasher = {
      hash,
      compare: jest.fn(),
    } as jest.Mocked<PasswordHasher>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupService,
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
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
    repository = module.get<InMemoryAuthUserRepository>('AuthUserRepository');
  });

  it('[TC-AUTH-001] should signup a user and publish UserJoinRequested event', async () => {
    const email = 'new@example.com';
    const password = 'password123';

    const authUser = await service.execute(email, password);

    expect(authUser).toBeDefined();
    expect(authUser.getEmail().getValue()).toBe(email);
    expect(authUser.getPasswordHash()).toBe('hashed_password123');
    expect(authUser.getRole()).toBe(UserRole.USER);

    const savedUser = await repository.findByEmail(authUser.getEmail());
    expect(savedUser).toBeDefined();
    expect(savedUser?.getId()).toBe(authUser.getId());

    expect(publishUserJoinRequested).toHaveBeenCalledWith(authUser);
  });

  it('should throw error if email already exists', async () => {
    const email = 'existing@example.com';
    const password = 'password123';

    await service.execute(email, password);

    await expect(service.execute(email, password)).rejects.toThrow(
      `User already exists: ${email}`,
    );
  });
});
