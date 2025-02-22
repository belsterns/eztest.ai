/**
  * @swagger
  * /api/webhook/{webhook_uuid}:
  *   post:
  *     tags:
  *       - Repository
  *     summary: Handle GitHub Webhook
  *     description: Processes a GitHub webhook event and triggers actions such as branch creation and pull request.
  *     parameters:
  *       - in: path
  *         name: webhook_uuid
  *         required: true
  *         schema:
  *           type: string
  *         description: Unique identifier for the webhook.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - ref
  *               - repository
  *             properties:
  *               ref:
  *                 type: string
  *                 example: "refs/heads/main"
  *               repository:
  *                 type: object
  *                 properties:
  *                   full_name:
  *                     type: string
  *                     example: "dev-utaa"
  *     responses:
  *       201:
  *         description: Webhook processed successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Branch 'main_unitTest' created successfully."
  *                 changedFiles:
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       filename:
  *                         type: string
  *                         example: "src/index.js"
  *                       status:
  *                         type: string
  *                         example: "modified"
  *                       changes:
  *                         type: number
  *                         example: 5
  *                 repoFiles:
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       name:
  *                         type: string
  *                         example: "test/index.test.js"
  *                       path:
  *                         type: string
  *                         example: "test/index.test.js"
  *                       type:
  *                         type: string
  *                         example: "added"
  *                       content:
  *                         type: string
  *                         description: Base64 encoded file content
  *                         example: "c29tZS1iYXNlNjQtZW5jb2RlZC1jb250ZW50"
  *       400:
  *         description: Invalid webhook request.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Not a branch commit or invalid event type"
  *       500:
  *         description: Server error processing webhook.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Failed to process webhook"
  *                 error:
  *                   type: string
  *                   example: "Internal server error details"
  */