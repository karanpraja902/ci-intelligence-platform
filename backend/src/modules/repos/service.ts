import { prisma } from '../../lib/prisma.js';
import { fetchRepo, fetchUserRepos } from '../../lib/github.js';

export async function listConnectedRepos(userId: string) {
  const connections = await prisma.userRepository.findMany({
    where: { userId },
    include: { repo: true }
  });
  return connections.map(c => ({
    id: c.repo.id,
    githubId: c.repo.githubId.toString(),
    name: c.repo.name,
    fullName: c.repo.fullName,
    private: c.repo.private,
    ownerLogin: c.repo.ownerLogin,
    defaultBranch: c.repo.defaultBranch || undefined,
    connectedAt: c.connectedAt
  }));
}

export async function listGitHubRepos(accessToken: string) {
  const page1 = await fetchUserRepos(accessToken, 1);
  // For phase1 keep it single page; TODO: paginate
  return page1.map(r => ({
    githubId: r.id.toString(),
    name: r.name,
    fullName: r.full_name,
    private: r.private,
    ownerLogin: r.owner.login,
    defaultBranch: r.default_branch
  }));
}

export async function connectRepo({ userId, accessToken, fullName }: { userId: string; accessToken: string; fullName: string; }) {
  const repo = await fetchRepo(accessToken, fullName);
  const stored = await prisma.repository.upsert({
    where: { githubId: BigInt(repo.id) },
    create: {
      githubId: BigInt(repo.id),
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      ownerLogin: repo.owner.login,
      defaultBranch: repo.default_branch
    },
    update: {
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      ownerLogin: repo.owner.login,
      defaultBranch: repo.default_branch
    }
  });
  await prisma.userRepository.upsert({
    where: { userId_repoId: { userId, repoId: stored.id } },
    create: { userId, repoId: stored.id },
    update: {}
  });
  return stored;
}