import { User } from '../model/user.entity';

export interface UserEventPublisher {
  publishUserCreated(user: User): Promise<void>;
}
