/**
 * @swagger
 * tags:
 *   name: Policies
 *   description: Policy management
 */

/**
 * @swagger
 * /api/v1/policies:
 *   post:
 *     summary: Create a new policy
 *     tags: [Policies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *               - name
 *               - type
 *               - content
 *             properties:
 *               company_id:
 *                 type: integer
 *               template_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               content:
 *                 type: string
 *               configurations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     config_key:
 *                       type: string
 *                     config_value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Policy created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/policies:
 *   get:
 *     summary: Get all policies for a company
 *     tags: [Policies]
 *     parameters:
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Get only active policies
 *     responses:
 *       200:
 *         description: List of policies
 */

/**
 * @swagger
 * /api/v1/policies/{id}:
 *   get:
 *     summary: Get a policy by ID
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Policy ID
 *     responses:
 *       200:
 *         description: Policy details
 *       404:
 *         description: Policy not found
 */

/**
 * @swagger
 * /api/v1/policies/{id}/approve:
 *   post:
 *     summary: Approve a policy
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Policy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved_by
 *             properties:
 *               approved_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Policy approved successfully
 *       404:
 *         description: Policy not found
 */
