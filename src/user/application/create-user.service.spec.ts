import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { UserDomainService } from '../domain/service/user-domain.service';
import { InMemoryUserRepository } from '../infrastructure/database/in-memory-user.repository';
import { UserEventPublisher } from '../domain/repository/user-event.publisher';
import { UserStatus } from '../domain/types/user-status.enum';
import { UserRole } from '../../shared/types/user-role.enum';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let repository: InMemoryUserRepository;
  let publisher: UserEventPublisher;

  beforeEach(async () => {
    publisher = {
      publishUserCreated: jest.fn().mockResolvedValue(undefined),
    };

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

  it('should create a user and publish event', async () => {
    const id = 'uuid-1';
    const email = 'test@example.com';

    await service.execute(id, email);

    const user = await repository.findById(id);
    expect(user).toBeDefined();
    expect(user?.getEmail().getValue()).toBe(email);
    expect(user?.getStatus()).toBe(UserStatus.PENDING);
    expect(user?.getRole()).toBe(UserRole.USER);
    expect(publisher.publishUserCreated).toHaveBeenCalled();
  });

  it('should create a user with specified role', async () => {
    const id = 'uuid-2';
    const email = 'admin@example.com';

    await service.execute(id, email, UserRole.ADMIN);

    const user = await repository.findById(id);
    expect(user?.getRole()).toBe(UserRole.ADMIN);
  });

  it('should be idempotent by ID', async () => {
    const id = 'uuid-1';
    const email = 'test@example.com';

    await service.execute(id, email);
    await service.execute(id, email);

    expect(publisher.publishUserCreated).toHaveBeenCalledTimes(1);
  });
});
