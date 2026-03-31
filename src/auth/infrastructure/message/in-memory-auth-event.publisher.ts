import { Injectable, Logger } from '@nestjs/common';
import type { AuthEventPublisher } from '../../domain/repository/auth-event.publisher';
import { AuthUser } from '../../domain/model/auth-user.entity';

@Injectable()
export class InMemoryAuthEventPublisher implements AuthEventPublisher {
  private readonly logger = new Logger(InMemoryAuthEventPublisher.name);

  async publishUserJoinRequested(authUser: AuthUser): Promise<void> {
    this.logger.log(`UserJoinRequested event published: ${authUser.getId()} - ${authUser.getEmail().getValue()} - role: ${authUser.getRole()}`);
    // In a real implementation, this would send an actual message with the role.
  }

  async publishUserLoggedIn(authUser: AuthUser): Promise<void> {
    this.logger.log(`UserLoggedIn event published: ${authUser.getId()}`);
  }
}
