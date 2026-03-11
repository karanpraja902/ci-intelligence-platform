import axios from 'axios';
import { config } from '../config/env.js';

export type GitHubUser = {
  id: number;
  login: string;
  name?: string;
  avatar_url?: string;
  email?: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: { login: string };
  default_branch: string;
};

export async function exchangeCodeForToken(code: string) {
  const resp = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code,
      redirect_uri: config.github.redirectUri
    },
    { headers: { Accept: 'application/json' } }
  );
  return resp.data as { access_token: string; token_type: string; scope: string };
}

export async function fetchGitHubUser(accessToken: string) {
  const resp = await axios.get<GitHubUser>('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return resp.data;
}

export async function fetchGitHubEmails(accessToken: string) {
  const resp = await axios.get<Array<{ email: string; primary: boolean; verified: boolean }>>(
    'https://api.github.com/user/emails',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return resp.data;
}

export async function fetchUserRepos(accessToken: string, page = 1) {
  const resp = await axios.get<GitHubRepo[]>(`https://api.github.com/user/repos`, {
    params: { per_page: 100, page, sort: 'updated' },
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return resp.data;
}

export async function fetchRepo(accessToken: string, fullName: string) {
  const resp = await axios.get<GitHubRepo>(`https://api.github.com/repos/${fullName}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return resp.data;
}