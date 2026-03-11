import { Router } from 'express';
import { z } from 'zod';
import type { AuthedRequest } from '../../middleware/auth.js';
import { connectRepo, listConnectedRepos, listGitHubRepos } from './service.js';
import { getLatestAccessToken } from '../auth/service.js';

const router = Router();

router.get('/api/repos', async (req: AuthedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const repos = await listConnectedRepos(req.user.id);
    res.json({ repos });
  } catch (e) { next(e); }
});

router.get('/api/github/repos', async (req: AuthedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const token = await getLatestAccessToken(req.user.id);
    if (!token) return res.status(400).json({ error: 'No GitHub token on file' });
    const repos = await listGitHubRepos(token);
    res.json({ repos });
  } catch (e) { next(e); }
});

const connectBody = z.object({ fullName: z.string().min(1) });

router.post('/api/repos/connect', async (req: AuthedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const parsed = connectBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    const token = await getLatestAccessToken(req.user.id);
    if (!token) return res.status(400).json({ error: 'No GitHub token on file' });
    const saved = await connectRepo({ userId: req.user.id, accessToken: token, fullName: parsed.data.fullName });
    res.json({ repo: {
      id: saved.id,
      githubId: saved.githubId.toString(),
      name: saved.name,
      fullName: saved.fullName,
      private: saved.private,
      ownerLogin: saved.ownerLogin,
      defaultBranch: saved.defaultBranch || undefined
    }});
  } catch (e) { next(e); }
});

export default router;