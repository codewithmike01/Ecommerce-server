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
 *   name: Products
 *   description: Product service endpoints
 */

/**
 * @swagger
 * /api/products/:
 *   get:
 *     tags: [Products]
 *     summary: Get all Products.
 *     description: Retrieve a products in db.
 *     parameters:
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of products.
 */

/**
 * @swagger
 * /api/products/category:
 *   get:
 *     tags: [Products]
 *     summary: Get products, optionally filtered by category ID.
 *     description: Retrieve all products or products in a specific category.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: The optional ID of the category to filter products.
 *     responses:
 *       '200':
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */

/**
 * @swagger
 * /api/products/:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: Save product information to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *                 example: "Smartphone"
 *                 required: true
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *                 example: "A latest model smartphone with 64GB storage"
 *                 required: true
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: The price of the product
 *                 example: 499.99
 *                 required: true
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The ObjectId references to product categories
 *                   example: "60f7d41b9f1b1a40d8f6c5a5"
 *                 description: List of categories associated with the product
 *                 required: true
 *               stock:
 *                 type: integer
 *                 description: The quantity of the product in stock
 *                 example: 100
 *                 default: 0
 *     responses:
 *       '200':
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /api/products/category:
 *   post:
 *     tags: [Products]
 *     summary: Create a new Category
 *     description: Save Category information to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Category
 *                 example: "Smartphone"
 *                 required: true
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *                 example: "A latest model smartphone with 64GB storage"
 *                 required: true
 *     responses:
 *       '200':
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /api/products/purchase:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: Save product information to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The ObjectId references to product
 *                   example: "60f7d41b9f1b1a40d8f6c5a5"
 *                 description: List of id associated with the product
 *                 required: true
 *     responses:
 *       '200':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Server error.
 */
