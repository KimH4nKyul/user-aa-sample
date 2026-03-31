import { Injectable, Inject } from '@nestjs/common';
import { UserDomainService } from '../domain/service/user-domain.service';
import type { UserRepository } from '../domain/repository/user.repository';
import type { UserEventPublisher } from '../domain/repository/user-event.publisher';
import { User } from '../domain/model/user.entity';
import { Email } from '../domain/model/email.vo';
import { UserRole } from '../../shared/types/user-role.enum';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userDomainService: UserDomainService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('UserEventPublisher')
    private readonly userEventPublisher: UserEventPublisher,
  ) {}

  public async execute(id: string, emailStr: string, role: UserRole = UserRole.USER): Promise<void> {
    // 0. Idempotency check
    const existingUser = await this.userRepository.findById(id);
    if (existingUser) {
      return;
    }

    const email = Email.from(emailStr);

    // 1. Check email uniqueness via domain service
    await this.userDomainService.validateEmailUniqueness(email);

    // 2. Create User entity
    const user = User.create(id, email, role);

    // 3. Save user
    await this.userRepository.save(user);

    // 4. Emit UserCreated event
    await this.userEventPublisher.publishUserCreated(user);
  }
}
