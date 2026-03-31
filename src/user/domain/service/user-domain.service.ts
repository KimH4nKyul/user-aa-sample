import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../repository/user.repository';
import { Email } from '../model/email.vo';

@Injectable()
export class UserDomainService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  public async validateEmailUniqueness(email: Email): Promise<void> {
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new Error(`Email already exists: ${email.getValue()}`);
    }
  }
}
