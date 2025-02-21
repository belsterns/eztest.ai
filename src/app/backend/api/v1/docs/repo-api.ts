/**
  * @swagger
  * /api/repo/validate:
  *   post:
  *     tags:
  *       - Repository
  *     summary: Validate repository details
  *     description: Validates a repository's details using the provided token and fetches repository information.
  *     parameters:
  *       - in: header
  *         name: x-origin-token
  *         required: true
  *         schema:
  *           type: string
  *         description: GitHub authentication token.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - remote_origin
  *               - organization_name
  *               - repo_name
  *             properties:
  *               remote_origin:
  *                 type: string
  *                 example: "Github"
  *               organization_name:
  *                 type: string
  *                 example: "belsterns"
  *               repo_name:
  *                 type: string
  *                 example: "cop"
  *     responses:
  *       200:
  *         description: Repository details verified successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Repository verified successfully"
  *                 data:
  *                   type: object
  *                   description: Repository details
  *       400:
  *         description: Invalid request payload.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Invalid repository details"
  *       401:
  *         description: Unauthorized - Missing or invalid GitHub token.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Invalid GitHub token"
  *       404:
  *         description: Repository not found.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Repository not found"
  *       500:
  *         description: Server error.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Failed to validate repository"
  *                 error:
  *                   type: string
  *                   example: "Internal server error details"
  */


 /**
  * @swagger
  * 
  * /api/repo:
  *   post:
  *     tags:
  *       - Repository
  *     summary: Save repository details
  *     description: Saves repository details and returns a webhook URL.
  *     parameters:
  *       - in: header
  *         name: x-origin-token
  *         required: true
  *         schema:
  *           type: string
  *         description: GitHub authentication token.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - host_url
  *               - nocobase_id
  *               - remote_origin
  *               - organization_name
  *               - repo_name
  *             properties:
  *               host_url:
  *                 type: string
  *                 example: "https://github.com"
  *               nocobase_id:
  *                 type: string
  *                 example: "9e8cc330-95d3-47d0-83f1-1b6624778fc0"
  *               remote_origin:
  *                 type: string
  *                 example: "Github"
  *               organization_name:
  *                 type: string
  *                 example: "belsterns"
  *               repo_name:
  *                 type: string
  *                 example: "cop-test"
  *     responses:
  *       200:
  *         description: Repository saved successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: "https://your-domain.com/api/webhook/uuid-1234"
  *       401:
  *         description: Unauthorized - Missing or invalid GitHub token.
  *       500:
  *         description: Server error.
  *
  *   patch:
  *     tags:
  *       - Repository
  *     summary: Update repository details
  *     description: Updates repository details using the provided information.
  *     parameters:
  *       - in: header
  *         name: x-origin-token
  *         required: true
  *         schema:
  *           type: string
  *         description: GitHub authentication token.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - host_url
  *               - nocobase_id
  *               - repo_url
  *             properties:
  *               host_url:
  *                 type: string
  *                 example: "https://github.com"
  *               nocobase_id:
  *                 type: string
  *                 example: "9e8cc330-95d3-47d0-83f1-1b6624778fc0"
  *               repo_url:
  *                 type: string
  *                 example: "https://github.com/belsterns/cop-test"
  *     responses:
  *       200:
  *         description: Repository updated successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Repository details updated successfully"
  *                 webhook_url:
  *                   type: string
  *                   example: "https://your-domain.com/api/webhook/uuid-5678"
  *       401:
  *         description: Unauthorized - Missing or invalid GitHub token.
  *       404:
  *         description: Repository not found.
  *       500:
  *         description: Server error.
  *
  *   delete:
  *     tags:
  *       - Repository
  *     summary: Delete a repository
  *     description: Deletes a repository using its `nocobase_id`.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - nocobase_id
  *             properties:
  *               nocobase_id:
  *                 type: string
  *                 example: "9e8cc330-95d3-47d0-83f1-1b6624778fc0"
  *     responses:
  *       200:
  *         description: Repository deleted successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: "Deleted repository 'cop-test' from organization 'belsterns' successfully."
  *       404:
  *         description: Repository not found.
  *       500:
  *         description: Server error.
  */