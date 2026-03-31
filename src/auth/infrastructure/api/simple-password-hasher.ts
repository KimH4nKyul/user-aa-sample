import { Injectable } from '@nestjs/common';
import type { PasswordHasher } from '../../domain/repository/password-hasher';

@Injectable()
export class SimplePasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return Promise.resolve(`hashed_${password}`);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(hash === `hashed_${password}`);
  }
}
