/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Manage policy templates
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Policy:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         content:
 *           type: string
 *         version:
 *           type: number
 *         is_active:
 *           type: boolean
 *         company_id:
 *           type: number
 *     Template:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         version:
 *           type: number
 *         default_content:
 *           type: string
 *         is_active:
 *           type: boolean
 *         created_by:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         policies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Policy'
 */

/**
 * @swagger
 * /api/v1/templates:
 *   post:
 *     summary: Create a new policy template
 *     tags: [Templates]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server error
 */

/**
 * @swagger
 * /api/v1/templates:
 *   get:
 *     summary: Get all policy templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by template type
 *     responses:
 *       200:
 *         description: List of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 *       500:
 *         description: Internal Server error
 */

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   get:
 *     summary: Get a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal Server error
 */

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   put:
 *     summary: Update a policy template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server error
 */

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   delete:
 *     summary: Delete a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal Server error
 */
/**
 * @swagger
 * /api/v1/templates/approve/{id}:
 *   put:
 *     summary: Approve a template and its associated policies
 *     tags: [Template Approvals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the template to approve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template and policies approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Template and related policies approved successfully"
 *                 template:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Unauthorized or approval error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Only users with the CTO role can approve templates and policies."
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal Server error
 */

/**
 * @swagger
 * /api/v1/templates/pending:
 *   get:
 *     summary: Get list of templates and associated policies needing approval
 *     tags: [Template Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates and policies awaiting approval
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 *       500:
 *         description: Internal Server error
 */
