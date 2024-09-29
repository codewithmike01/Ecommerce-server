// Define security definitions for bearer token authentication
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     AuthorizationHeader:
 *       in: header
 *       name: Authorization
 *       schema:
 *         type: string
 *       required: true
 *       description: token
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order service endpoints
 */

/**
 * @swagger
 * /api/orders/:
 *   get:
 *     tags: [Orders]
 *     summary: Get all Orders by a user.
 *     description: Retrieve a order by a user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of order.
 */
