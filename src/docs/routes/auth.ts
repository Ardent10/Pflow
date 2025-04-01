import { Router } from "express";
import * as authController from "../../controllers/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or validation error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/auth/join-company:
 *   post:
 *     summary: Join a company as a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - company_id
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *               company_id:
 *                 type: integer
 *                 description: The ID of the company to join
 *               role:
 *                 type: string
 *                 enum: [employee, manager, admin, cto, hr]
 *                 description: The role to be assigned within the company
 *               team:
 *                 type: string
 *                 enum: [admin, engineering ,sales ,hr]
 *                 description: The team to be assigned within the company
 *     responses:
 *       201:
 *         description: Successfully joined the company
 *       400:
 *         description: Bad request or validation error
 *       404:
 *         description: Company not found
 */

export default router;
