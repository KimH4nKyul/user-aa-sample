import { Injectable } from '@nestjs/common';
import type { TokenProvider } from '../../domain/repository/token-provider';

@Injectable()
export class SimpleTokenProvider implements TokenProvider {
  async issue(payload: any): Promise<string> {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  async validate(token: string): Promise<any> {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch {
      throw new Error('Invalid token');
    }
  }
}
