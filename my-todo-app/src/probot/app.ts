import { Probot } from "probot";

export default (app: Probot) => {
  app.on("push", async (context) => {
    const { ref, repository } = context.payload;

    // Trigger branch creation on a specific push
    if (ref === "refs/heads/main") {
      await context.octokit.git.createRef({
        owner: repository.owner.login,
        repo: repository.name,
        ref: "refs/heads/new-branch",
        sha: context.payload.after,
      });
    }
  });
};
