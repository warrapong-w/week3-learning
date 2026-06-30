const express = require('express');
const db = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// POST /orders — create order
const {requireFields} = require('../middleware/validator');

router.post('/', 
    requireFields('customerId', 'drinkId', 'quantity'),
    asyncHandler(async (req, res) => {
        const { customerId, drinkId, quantity } = req.body;
        
        
        if (quantity <= 0) {
            return res.status(400).json({ error: 'quantity ต้อง > 0' });
        }
        
        // Check existence
        const customer = await db.query(
            'SELECT id, name FROM customers WHERE id = $1',
            [customerId]
        );
        if (customer.length === 0) {
            return res.status(404).json({ error: `Customer id ${customerId} ไม่พบ` });
        }
        
        const drink = await db.query(
            'SELECT id, name, price FROM drinks WHERE id = $1',
            [drinkId]
        );
        if (drink.length === 0) {
            return res.status(404).json({ error: `Drink id ${drinkId} ไม่พบ` });
        }
        
        // Insert
        const result = await db.query(
            `INSERT INTO orders (customer_id, drink_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING id, order_date`,
            [customerId, drinkId, quantity]
        );
        
        const newOrder = result[0];
        const total = quantity * drink[0].price;
        
        res.status(201).json({
            id: newOrder.id,
            customer: customer[0].name,
            drink: drink[0].name,
            quantity,
            total,
            order_date: newOrder.order_date
        });
    
}));

// GET /orders — list orders with pagination
router.get('/', asyncHandler (async (req, res) => {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const offset = (page - 1) * limit;
        
        const orders = await db.query(`
            SELECT 
                o.id,
                c.name AS customer,
                d.name AS drink,
                o.quantity,
                o.quantity * d.price AS total,
                o.order_date
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN drinks d ON o.drink_id = d.id
            ORDER BY o.id DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        
        res.json({
            page,
            limit,
            count: orders.length,
            data: orders
        });
    
}));

module.exports = router;