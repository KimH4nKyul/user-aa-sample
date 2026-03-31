import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { SignupService } from '../../application/signup.service';
import {
  LoginService,
  ValidateTokenService,
} from '../../application/auth-manage.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
    private readonly validateTokenService: ValidateTokenService,
  ) {}

  @Post('signup')
  async signup(@Body() body: Record<string, string>) {
    const authUser = await this.signupService.execute(
      body.email,
      body.password,
    );
    return {
      id: authUser.getId(),
      email: authUser.getEmail().getValue(),
    };
  }

  @Post('login')
  async login(@Body() body: Record<string, string>) {
    const accessToken = await this.loginService.execute(
      body.email,
      body.password,
    );
    return { accessToken };
  }

  @Get('validate-token')
  async validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    const payload = (await this.validateTokenService.execute(token)) as {
      sub: string;
    };
    return {
      userId: payload.sub,
      valid: true,
    };
  }
}
