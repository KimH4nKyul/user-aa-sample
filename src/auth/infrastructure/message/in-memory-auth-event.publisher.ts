import { Injectable } from '@nestjs/common';
import type { AuthEventPublisher } from '../../domain/repository/auth-event.publisher';
import { AuthUser } from '../../domain/model/auth-user.entity';

@Injectable()
export class InMemoryAuthEventPublisher implements AuthEventPublisher {
  publishUserJoinRequested(authUser: AuthUser): Promise<void> {
    console.log(
      `Event Published: UserJoinRequested for ${authUser.getEmail().getValue()}`,
    );
    return Promise.resolve();
  }

  publishUserLoggedIn(authUser: AuthUser): Promise<void> {
    console.log(
      `Event Published: UserLoggedIn for ${authUser.getEmail().getValue()}`,
    );
    return Promise.resolve();
  }
}
