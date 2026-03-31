import { Injectable, Logger } from '@nestjs/common';
import { UserEventPublisher } from '../../domain/repository/user-event.publisher';
import { User } from '../../domain/model/user.entity';

@Injectable()
export class InMemoryUserEventPublisher implements UserEventPublisher {
  private readonly logger = new Logger(InMemoryUserEventPublisher.name);

  async publishUserCreated(user: User): Promise<void> {
    this.logger.log(`UserCreated event published: ${user.getId()} - ${user.getEmail().getValue()}`);
  }
}
