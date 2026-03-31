import { Module } from '@nestjs/common';
import { UserDomainService } from './domain/service/user-domain.service';
import { CreateUserService } from './application/create-user.service';
import {
  GetUserService,
  ActivateUserService,
  DeactivateUserService,
} from './application/user-manage.service';
import { UserController } from './entry-point/http-api/user.controller';
import { UserConsumer } from './entry-point/consumer/user.consumer';
import { InMemoryUserRepository } from './infrastructure/database/in-memory-user.repository';
import { InMemoryUserEventPublisher } from './infrastructure/message/in-memory-user-event.publisher';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController, UserConsumer],
  providers: [
    UserDomainService,
    CreateUserService,
    GetUserService,
    ActivateUserService,
    DeactivateUserService,
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: 'UserEventPublisher',
      useClass: InMemoryUserEventPublisher,
    },
  ],
  exports: [CreateUserService, GetUserService],
})
export class UserModule {}
