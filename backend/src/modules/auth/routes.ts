import { Router } from 'express';
import { config } from '../../config/env.js';
import { handleGitHubCallback, getUserProfile } from './service.js';
import type { AuthedRequest } from '../../middleware/auth.js';

const router = Router();

router.get('/auth/github', (req, res) => {
  const redirectUri = config.github.redirectUri;
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', config.github.clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', config.github.scope);
  // TODO: add proper state/nonce
  res.redirect(url.toString());
});

router.get('/auth/github/callback', async (req, res, next) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('Missing code');
    const { redirectUrl } = await handleGitHubCallback(code);
    res.redirect(302, redirectUrl);
  } catch (e) {
    next(e);
  }
});

router.get('/api/me', async (req: AuthedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await getUserProfile(req.user.id);
    res.json({ user: profile });
  } catch (e) { next(e); }
});

export default router;