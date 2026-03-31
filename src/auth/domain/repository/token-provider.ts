export interface TokenProvider {
  issue(payload: Record<string, unknown>): Promise<string>;
  validate(token: string): Promise<unknown>;
}
