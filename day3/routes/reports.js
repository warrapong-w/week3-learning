const express = require('express');
const db = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();


router.get('/top', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const top = await db.query(`
      SELECT
        c.id,
        c.name,
        c.city,
        COUNT(o.id)::INTEGER AS order_count,
        SUM(o.quantity * d.price)::INTEGER AS total_spent
      FROM customers c
      JOIN orders o ON o.customer_id = c.id
      JOIN drinks d ON o.drink_id = d.id
      GROUP BY c.id, c.name, c.city
      ORDER BY total_spent DESC
      LIMIT $1`
    , [limit]);

    res.json(top);
 
}));


router.get('/summary', asyncHandler(async (req, res) => {
    const totals = await db.query(`
      SELECT
        COUNT(*)::INTEGER AS order_count,
        SUM(o.quantity * d.price)::INTEGER AS revenue
      FROM orders o
      JOIN drinks d ON o.drink_id = d.id
      `)

    const byCategory = await db.query(`
      SELECT
        d.category,
        COUNT(o.id):: INTEGER AS order_count,
        SUM(o.quantity * d.price):: INTEGER AS revenue
      FROM orders o
      JOIN drinks d ON o.drink_id = d.id
      GROUP BY d.category
      ORDER BY revenue DESC
      `)
    res.json({
      total: totals[0],
      by_category: byCategory
    })
}));

module.exports = router;
