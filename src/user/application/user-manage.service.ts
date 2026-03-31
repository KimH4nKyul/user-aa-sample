import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/repository/user.repository';
import { User } from '../domain/model/user.entity';

@Injectable()
export class GetUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User not found: ${id}`);
    }
    return user;
  }
}

@Injectable()
export class ActivateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User not found: ${id}`);
    }

    user.activate();
    await this.userRepository.save(user);
    return user;
  }
}

@Injectable()
export class DeactivateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User not found: ${id}`);
    }

    user.deactivate();
    await this.userRepository.save(user);
    return user;
  }
}
