import { Controller } from '@nestjs/common';
import { CreateUserService } from '../../application/create-user.service';
import { UserRole } from '../../../shared/types/user-role.enum';

@Controller()
export class UserConsumer {
  constructor(private readonly createUserService: CreateUserService) {}

  // This would be replaced with actual event decorator depending on infra (e.g., @EventPattern)
  async handleUserJoinRequested(event: {
    id: string;
    email: string;
    role?: UserRole;
  }) {
    await this.createUserService.execute(
      event.id,
      event.email,
      event.role || UserRole.USER,
    );
  }
}
