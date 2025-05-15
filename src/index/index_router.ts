import express from 'express';
import { IndexController } from './index_controller';
import { body, query } from 'express-validator';

const router = express.Router();
const controller = new IndexController();

// Define routes
// These paths are relative to where this router is mounted in app_config.ts

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root/Welcome Page
 *     description: Returns the main welcome page (HTML).
 *     security: []
 *     responses:
 *       '200':
 *         description: Successful response, HTML content.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', controller.getRoot);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the API, including uptime.
 *     security: []
 *     responses:
 *       '200':
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 data:
 *                   $ref: '#/components/schemas/HealthStatus'
 *       '500':
 *         description: API is unhealthy or error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health', controller.getHealth);

/**
 * @openapi
 * /api/v1/validate-example:
 *   post:
 *     summary: Validation Example
 *     description: Demonstrates input validation using express-validator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 description: User's name.
 *             required:
 *               - email
 *               - name
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: A numeric ID.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [books, electronics, fashion]
 *         required: false
 *         description: Optional category.
 *     responses:
 *       '200':
 *         description: Validation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       '400':
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/v1/validate-example',
    [
        body('email').isEmail().withMessage('Must be a valid email address'),
        body('name').isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        query('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
        query('category').optional().isString().isIn(['books', 'electronics', 'fashion']).withMessage('Invalid category')
    ],
    controller.postValidateExample
);

/**
 * @openapi
 * /api/v1/sum:
 *   post:
 *     summary: Sum two numbers
 *     description: Calculates the sum of two numbers provided in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               a:
 *                 type: number
 *                 description: The first number.
 *               b:
 *                 type: number
 *                 description: The second number.
 *             required:
 *               - a
 *               - b
 *     responses:
 *       '200':
 *         description: Sum calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Sum calculated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: number
 *                       example: 8
 *       '400':
 *         description: Validation failed (e.g., non-numeric input)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/v1/sum',
    [
        body('a').isNumeric().withMessage('Parameter a must be a number').toFloat(), // Convert to float after validation
        body('b').isNumeric().withMessage('Parameter b must be a number').toFloat()  // Convert to float after validation
    ],
    controller.postSumTwoDigits
);

export default router; 