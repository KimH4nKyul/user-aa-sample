import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { UserDomainService } from '../domain/service/user-domain.service';
import { InMemoryUserRepository } from '../infrastructure/database/in-memory-user.repository';
import type { UserEventPublisher } from '../domain/repository/user-event.publisher';
import { UserStatus } from '../domain/types/user-status.enum';
import { UserRole } from '../../shared/types/user-role.enum';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let repository: InMemoryUserRepository;
  let publishUserCreated: jest.Mock;
  let publisher: jest.Mocked<UserEventPublisher>;

  beforeEach(async () => {
    publishUserCreated = jest.fn().mockResolvedValue(undefined);
    publisher = {
      publishUserCreated,
    } as jest.Mocked<UserEventPublisher>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        UserDomainService,
        {
          provide: 'UserRepository',
          useClass: InMemoryUserRepository,
        },
        {
          provide: 'UserEventPublisher',
          useValue: publisher,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    repository = module.get<InMemoryUserRepository>('UserRepository');
  });

  it('[TC-USER-001] should create a user and publish event', async () => {
    const id = 'uuid-1';
    const email = 'test@example.com';

    await service.execute(id, email);

    const user = await repository.findById(id);
    expect(user).toBeDefined();
    expect(user?.getEmail().getValue()).toBe(email);
    expect(user?.getStatus()).toBe(UserStatus.PENDING);
    expect(user?.getRole()).toBe(UserRole.USER);
    expect(publishUserCreated).toHaveBeenCalled();
  });

  it('should create a user with specified role', async () => {
    const id = 'uuid-2';
    const email = 'admin@example.com';

    await service.execute(id, email, UserRole.ADMIN);

    const user = await repository.findById(id);
    expect(user?.getRole()).toBe(UserRole.ADMIN);
  });

  it('[TC-USER-002] should fail if email already exists', async () => {
    const id1 = 'uuid-1';
    const id2 = 'uuid-2';
    const email = 'duplicate@example.com';

    await service.execute(id1, email);

    await expect(service.execute(id2, email)).rejects.toThrow(
      `Email already exists: ${email}`,
    );
  });

  it('[TC-USER-003] should be idempotent by ID', async () => {
    const id = 'uuid-1';
    const email = 'test@example.com';

    await service.execute(id, email);
    await service.execute(id, email);

    expect(publishUserCreated).toHaveBeenCalledTimes(1);
  });
});
