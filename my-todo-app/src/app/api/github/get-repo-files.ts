import { NextApiRequest, NextApiResponse } from "next";
import { getRepoFiles } from "../../services/githubService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { repo, owner, branch, path, accessToken } = req.query;

    try {
      const response = await getRepoFiles(repo as string, owner as string, branch as string, path as string, accessToken as string);
      res.status(200).json({ message: "Retrieved repository files", data: response });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve files", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
