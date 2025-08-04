const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         invoice_no:
 *           type: string
 *           description: Invoice number
 *         stock_code:
 *           type: string
 *           description: Product stock code
 *         description:
 *           type: string
 *           description: Product description
 *         quantity:
 *           type: integer
 *           description: Quantity of product
 *         invoice_date:
 *           type: string
 *           format: date
 *           description: Invoice date
 *         unit_price:
 *           type: number
 *           format: float
 *           description: Unit price of product
 *         customer_id:
 *           type: string
 *           description: Customer ID
 *         country:
 *           type: string
 *           description: Country
 *       example:
 *         invoice_no: "536365"
 *         stock_code: "85123A"
 *         description: "WHITE HANGING HEART T-LIGHT HOLDER"
 *         quantity: 6
 *         invoice_date: "2010-12-01"
 *         unit_price: 2.55
 *         customer_id: "17850"
 *         country: "United Kingdom"
 *     ProductInput:
 *       type: object
 *       required:
 *         - invoice_no
 *         - stock_code
 *         - description
 *         - quantity
 *         - unit_price
 *         - customer_id
 *       properties:
 *         invoice_no:
 *           type: string
 *           description: Invoice number
 *         stock_code:
 *           type: string
 *           description: Product stock code
 *         description:
 *           type: string
 *           description: Product description
 *         quantity:
 *           type: integer
 *           description: Quantity of product
 *         invoice_date:
 *           type: string
 *           format: date
 *           description: Invoice date
 *         unit_price:
 *           type: number
 *           format: float
 *           description: Unit price of product
 *         customer_id:
 *           type: string
 *           description: Customer ID
 *         country:
 *           type: string
 *           description: Country
 *       example:
 *         invoice_no: "536366"
 *         stock_code: "85123B"
 *         description: "BLACK HANGING HEART T-LIGHT HOLDER"
 *         quantity: 3
 *         invoice_date: "2010-12-01"
 *         unit_price: 2.75
 *         customer_id: "17851"
 *         country: "United Kingdom"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Product not found"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs for online retail data
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 1000
 *         description: Maximum number of products to return
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const result = await pool.query('SELECT * FROM online_retail_data LIMIT $1', [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by stock code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock code of the product
 *         example: "85123A"
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM online_retail_data WHERE stock_code = $1 LIMIT 1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error while fetching product' });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  const { invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country } = req.body;
  
  // Validate required fields
  if (!invoice_no || !stock_code || !description || quantity === undefined || !unit_price || !customer_id) {
    return res.status(400).json({ 
      error: 'Missing required fields: invoice_no, stock_code, description, quantity, unit_price, customer_id' 
    });
  }

  // Validate data types
  if (typeof quantity !== 'number' || typeof unit_price !== 'number') {
    return res.status(400).json({ 
      error: 'quantity and unit_price must be numbers' 
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO online_retail_data (invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new product:', err);
    
    // Handle duplicate key error
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Product with this stock code already exists' });
    }
    
    res.status(500).json({ error: 'Server error while creating product' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product's description by stock code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code of the product to update
 *         example: "85123A"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 description: New product description
 *             example:
 *               description: "Updated product description"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  
  // Validate input
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required and must be a string' });
  }

  try {
    const result = await pool.query(
      'UPDATE online_retail_data SET description = $1 WHERE stock_code = $2 RETURNING *',
      [description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by stock code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code of the product to delete
 *         example: "85123A"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Product deleted successfully"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM online_retail_data WHERE stock_code = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

module.exports = router;