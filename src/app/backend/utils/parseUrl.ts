export function parseRepoUrl(url: string): any {
  const match = url.match(/https?:\/\/(.*?)\/(.*?)\/(.*)/);
  if (!match) return null;

  let host = match[1];
  const org = match[2];
  const repo = match[3];

  if (host.includes("github.com")) {
    host = "github";
  } else if (host.includes("gitlab.com")) {
    host = "gitlab";
  } else {
    host = "gitea";
  }

  return { hostName: host, orgName: org, repoName: repo };
}
