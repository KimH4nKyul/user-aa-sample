import { AuthUser } from '../model/auth-user.entity';

export interface AuthEventPublisher {
  publishUserJoinRequested(authUser: AuthUser): Promise<void>;
  publishUserLoggedIn(authUser: AuthUser): Promise<void>;
}
