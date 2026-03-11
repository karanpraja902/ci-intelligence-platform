import { prisma } from '../../lib/prisma.js';
import { config } from '../../config/env.js';
import { exchangeCodeForToken, fetchGitHubEmails, fetchGitHubUser } from '../../lib/github.js';
import { signJwt } from '../../lib/jwt.js';

export async function handleGitHubCallback(code: string) {
  const tokenResp = await exchangeCodeForToken(code);
  const accessToken = tokenResp.access_token;
  const ghUser = await fetchGitHubUser(accessToken);
  let email: string | undefined = ghUser.email || undefined;
  if (!email) {
    const emails = await fetchGitHubEmails(accessToken);
    const primary = emails.find(e => e.primary && e.verified);
    if (primary) email = primary.email;
  }

  const user = await prisma.user.upsert({
    where: { githubId: BigInt(ghUser.id) },
    create: {
      githubId: BigInt(ghUser.id),
      login: ghUser.login,
      name: ghUser.name ?? undefined,
      email,
      avatarUrl: ghUser.avatar_url ?? undefined
    },
    update: {
      login: ghUser.login,
      name: ghUser.name ?? undefined,
      email,
      avatarUrl: ghUser.avatar_url ?? undefined
    }
  });

  await prisma.oAuthToken.create({
    data: {
      userId: user.id,
      provider: 'github',
      accessToken,
      scope: tokenResp.scope,
      tokenType: tokenResp.token_type
    }
  });

  const jwt = signJwt({ userId: user.id, login: user.login });
  const redirectUrl = `${config.frontendUrl}/auth/callback#token=${jwt}`;
  return { redirectUrl };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? {
    id: user.id,
    login: user.login,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl
  } : null;
}

export async function getLatestAccessToken(userId: string) {
  const token = await prisma.oAuthToken.findFirst({
    where: { userId, provider: 'github' },
    orderBy: { createdAt: 'desc' }
  });
  return token?.accessToken || null;
}