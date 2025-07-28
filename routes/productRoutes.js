const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 */
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM online_retail_data LIMIT 100');
  res.json(result.rows);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by stock_code
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM online_retail_data WHERE stock_code = $1', [id]);
  res.json(result.rows);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 */
router.post('/', async (req, res) => {
  const { invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country } = req.body;
  const result = await pool.query(
    `INSERT INTO online_retail_data VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country]
  );
  res.status(201).json(result.rows[0]);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const result = await pool.query(
    'UPDATE online_retail_data SET description = $1 WHERE stock_code = $2 RETURNING *',
    [description, id]
  );
  res.json(result.rows[0]);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 */
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM online_retail_data WHERE stock_code = $1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
