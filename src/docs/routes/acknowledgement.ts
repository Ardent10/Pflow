/**
 * @swagger
 * tags:
 *   name: Acknowledgements
 *   description: Manage policy acknowledgements
 */

/**
 * @swagger
 * /api/v1/acknowledgements/pending:
 *   get:
 *     summary: Get pending acknowledgements
 *     tags: [Acknowledgements]
 *     parameters:
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by employee ID
 *       - in: query
 *         name: policy_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by policy ID
 *     responses:
 *       200:
 *         description: List of pending acknowledgements
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/acknowledgements/overdue:
 *   get:
 *     summary: Get overdue acknowledgements
 *     tags: [Acknowledgements]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         required: false
 *         description: Days threshold for overdue (default 30)
 *     responses:
 *       200:
 *         description: List of overdue acknowledgements
 *       404:
 *         description: No overdue acknowledgements found
 */

/**
 * @swagger
 * /api/v1/acknowledgements/{id}/acknowledge:
 *   post:
 *     summary: Acknowledge a policy
 *     tags: [Acknowledgements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Acknowledgement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: integer
 *               policy_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Policy acknowledged successfully
 *       404:
 *         description: Acknowledgement not found
 */

/**
 * @swagger
 * /api/v1/acknowledgements/acknowledge:
 *   post:
 *     summary: Acknowledge multiple policies
 *     tags: [Acknowledgements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: integer
 *                 description: Employee ID performing the acknowledgement
 *               policy_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of policy IDs to be acknowledged
 *     responses:
 *       200:
 *         description: Policies acknowledged successfully
 *       404:
 *         description: No policies found to acknowledge
 */

/**
 * @swagger
 * /api/v1/acknowledgements/{id}:
 *   get:
 *     summary: Get acknowledgement by ID
 *     tags: [Acknowledgements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Acknowledgement ID
 *     responses:
 *       200:
 *         description: Acknowledgement found
 *       404:
 *         description: Acknowledgement not found
 */
