import Tokens from 'csrf';

const tokens = new Tokens();

export function createCSRFSecret() {
  return tokens.secretSync();
}

export function createCsrfToken(secret: string) {
  return tokens.create(secret);
}

export function verifyCsrfToken(secret: string, csrfToken: string) {
  return tokens.verify(secret, csrfToken);
}
