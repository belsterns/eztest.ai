import axios from "../utils/axiosInstance";

export const createBranch = async (
  repo: string,
  owner: string,
  baseBranch: string,
  newBranch: string,
  accessToken: string
) => {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
  const baseRef = `refs/heads/${baseBranch}`;
  const newRef = `refs/heads/${newBranch}`;

  const { data: baseBranchData } = await axios.get(`${baseUrl}/${baseRef}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const response = await axios.post(
    baseUrl,
    {
      ref: newRef,
      sha: baseBranchData.object.sha,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data;
};

export const compareCommits = async (
    repo: string,
    owner: string,
    base: string,
    head: string,
    accessToken: string
  ) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/compare/${base}...${head}`;
  
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  
    return response.data;
  };

  export const getRepoFiles = async (
    repo: string,
    owner: string,
    branch: string,
    path: string,
    accessToken: string
  ) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  
    return response.data;
  };
  