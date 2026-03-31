import { Injectable } from '@nestjs/common';
import type { PasswordHasher } from '../../domain/repository/password-hasher';

@Injectable()
export class SimplePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    // Simplified hashing for this example
    return `hashed_${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return `hashed_${password}` === hash;
  }
}
