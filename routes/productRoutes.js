const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM online_retail_data LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by stock_code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The stock code of the product
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM online_retail_data WHERE stock_code = $1 LIMIT 1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Product not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).send('Server Error');
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
 *         description: The newly created product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input.
 */
router.post('/', async (req, res) => {
  const { invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO online_retail_data (invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new product:', err);
    res.status(400).send('Invalid input or database error');
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product's description by stock_code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code of the product to update.
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
 *     responses:
 *       200:
 *         description: The updated product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 *       400:
 *         description: Invalid input.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE online_retail_data SET description = $1 WHERE stock_code = $2 RETURNING *',
      [description, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Product not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).send('Invalid input or database error');
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by stock_code
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code of the product to delete.
 *     responses:
 *       204:
 *         description: Product successfully deleted.
 *       404:
 *         description: Product not found.
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM online_retail_data WHERE stock_code = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Product not found');
    res.status(204).json({message: "Product deleted successfully"}); // No Content
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
