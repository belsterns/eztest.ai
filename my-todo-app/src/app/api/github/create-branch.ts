import { NextApiRequest, NextApiResponse } from "next";
import { createBranch } from "../../services/githubService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { repo, owner, baseBranch, newBranch, accessToken } = req.body;

    try {
      const response = await createBranch(repo, owner, baseBranch, newBranch, accessToken);
      res.status(200).json({ message: "Branch created successfully", data: response });
    } catch (error) {
      res.status(500).json({ message: "Failed to create branch", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
