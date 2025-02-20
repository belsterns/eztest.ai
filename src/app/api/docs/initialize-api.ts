/**
  * @swagger
  * /api/initialize/{nocobaseId}:
  *   post:
  *     tags:
  *       - Repository
  *     summary: Initialize a full repository test
  *     description: Creates a new branch for full repository testing and fetches all files.
  *     parameters:
  *       - in: path
  *         name: nocobaseId
  *         required: true
  *         schema:
  *           type: string
  *         description: The ID associated with the repository in the database.
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
  *               - repo_url
  *               - baseBranch
  *             properties:
  *               repo_url:
  *                 type: string
  *                 example: "https://github.com/hariharan1809/test_repo"
  *               baseBranch:
  *                 type: string
  *                 example: "main"
  *     responses:
  *       201:
  *         description: Repository initialized successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Branch 'main_fullTest' created successfully for full test generation."
  *                 allFiles:
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       path:
  *                         type: string
  *                         example: "src/index.js"
  *                       content:
  *                         type: string
  *                         description: Base64 encoded file content
  *                         example: "c29tZS1iYXNlNjQtZW5jb2RlZC1jb250ZW50"
  *       400:
  *         description: Invalid request payload.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Repository name is required"
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
  *         description: Repository not found or already initialized.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Repository not found or it may have already been initialized. Please check the repository details."
  *       500:
  *         description: Server error.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: "Failed to process full repository"
  *                 error:
  *                   type: string
  *                   example: "Internal server error details"
  */