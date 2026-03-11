import { signJwt, verifyJwt } from '../src/lib/jwt';

test('sign and verify JWT', () => {
  const token = signJwt({ userId: 'u1', login: 'octocat' });
  const payload = verifyJwt(token);
  expect(payload.userId).toBe('u1');
  expect(payload.login).toBe('octocat');
});