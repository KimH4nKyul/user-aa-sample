import { Injectable } from '@nestjs/common';
import type { TokenProvider } from '../../domain/repository/token-provider';

@Injectable()
export class SimpleTokenProvider implements TokenProvider {
  issue(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload));
  }

  validate(token: string): Promise<unknown> {
    return Promise.resolve(JSON.parse(token));
  }
}
