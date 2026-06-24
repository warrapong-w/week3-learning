const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
      const name = req.query.name;       // ← เปลี่ยนชื่อ variable
      const city = req.query.city;       // ← bonus: เพิ่ม filter city ด้วย

      let sql = 'SELECT * FROM customers';
      const params = [];
      const conditions = [];

      if (name) {
          conditions.push(`name = $${params.length + 1}`);
          params.push(name);
      }

      if (city) {
          conditions.push(`city = $${params.length + 1}`);
          params.push(city);
      }

      if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY name';

      const customers = await db.query(sql, params);
      res.json(customers);

  } catch (err) {
      next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
        const id = parseInt(req.params.id); //it comes from the URL itself, not after `?`
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'id ต้องเป็นตัวเลข' });
        }
        
        const customers = await db.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );

         if (customers.length === 0) {
            return res.status(404).json({ error: 'customer not found' });
        }

         const orders = await db.query(`
            SELECT 
                o.id,
                d.name AS drink,
                o.quantity,
                o.quantity * d.price AS total,
                o.order_date
            FROM orders o
            JOIN drinks d ON o.drink_id = d.id
            WHERE o.customer_id = $1
            ORDER BY o.order_date DESC, o.id DESC
        `, [id]);
       
        
     // 3. คำนวณ stats
        let totalSpent = 0;
        for (const order of orders) {
            totalSpent += parseFloat(order.total);
        }
        
        // 4. Response รวม
        res.json({
            customer: customers[0],
            order_count: orders.length,
            total_spent: totalSpent,
            orders: orders
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;