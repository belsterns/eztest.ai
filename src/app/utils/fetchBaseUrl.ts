export function fetchBaseUrl(
  hostName: string,
  host_url?: string | null,
): string {
  const baseUrls: Record<string, string | undefined> = {
    github: process.env.GITHUB_API_BASE_URL,
    gitlab: process.env.GITLAB_API_BASE_URL,
    bitbucket: process.env.BITBUCKET_API_BASE_URL,
    gitea: process.env.GITEA_API_BASE_URL,
  };

  if (!baseUrls[hostName.toLowerCase()]) {
    throw { statusCode: 400, message: "Unsupported remote origin" };
  }

  return host_url || baseUrls[hostName.toLowerCase()]!;
}
