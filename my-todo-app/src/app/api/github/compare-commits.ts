import { NextApiRequest, NextApiResponse } from "next";
import { compareCommits } from "../../services/githubService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { repo, owner, base, head, accessToken } = req.query;

    try {
      const response = await compareCommits(repo as string, owner as string, base as string, head as string, accessToken as string);
      res.status(200).json({ message: "Compared commits successfully", data: response });
    } catch (error) {
      res.status(500).json({ message: "Failed to compare commits", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
