import { Injectable } from '@nestjs/common';
import type { UserEventPublisher } from '../../domain/repository/user-event.publisher';
import { User } from '../../domain/model/user.entity';

@Injectable()
export class InMemoryUserEventPublisher implements UserEventPublisher {
  publishUserCreated(user: User): Promise<void> {
    console.log(
      `Event Published: UserCreated for ${user.getEmail().getValue()}`,
    );
    return Promise.resolve();
  }
}
