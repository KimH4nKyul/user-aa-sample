import { Module } from '@nestjs/common';
import { SignupService } from './application/signup.service';
import {
  LoginService,
  ValidateTokenService,
} from './application/auth-manage.service';
import { AuthController } from './entry-point/http-api/auth.controller';
import { InMemoryAuthUserRepository } from './infrastructure/database/in-memory-auth-user.repository';
import { InMemoryAuthEventPublisher } from './infrastructure/message/in-memory-auth-event.publisher';
import { SimplePasswordHasher } from './infrastructure/api/simple-password-hasher';
import { SimpleTokenProvider } from './infrastructure/api/simple-token-provider';

@Module({
  controllers: [AuthController],
  providers: [
    SignupService,
    LoginService,
    ValidateTokenService,
    {
      provide: 'AuthUserRepository',
      useClass: InMemoryAuthUserRepository,
    },
    {
      provide: 'AuthEventPublisher',
      useClass: InMemoryAuthEventPublisher,
    },
    {
      provide: 'PasswordHasher',
      useClass: SimplePasswordHasher,
    },
    {
      provide: 'TokenProvider',
      useClass: SimpleTokenProvider,
    },
  ],
  exports: [ValidateTokenService],
})
export class AuthModule {}
