export interface TokenProvider {
  issue(payload: any): Promise<string>;
  validate(token: string): Promise<any>;
}
