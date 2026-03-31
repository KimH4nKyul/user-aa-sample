import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GetUserService, ActivateUserService, DeactivateUserService } from '../../application/user-manage.service';
import { Roles } from '../../../auth/entry-point/http-api/roles.decorator';
import { RolesGuard } from '../../../auth/entry-point/http-api/roles.guard';
import { UserRole } from '../../../shared/types/user-role.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly activateUserService: ActivateUserService,
    private readonly deactivateUserService: DeactivateUserService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.getUserService.execute(id);
    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      status: user.getStatus(),
      role: user.getRole(),
    };
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async activate(@Param('id') id: string) {
    const user = await this.activateUserService.execute(id);
    return {
      id: user.getId(),
      status: user.getStatus(),
    };
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deactivate(@Param('id') id: string) {
    const user = await this.deactivateUserService.execute(id);
    return {
      id: user.getId(),
      status: user.getStatus(),
    };
  }
}
