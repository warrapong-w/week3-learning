const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /menu — list all drinks
router.get('/', async (req, res, next) => {
    try {
        const category = req.query.category; // comes from url after ?
        
        let sql = 'SELECT * FROM drinks';
        const params = [];
        
        if (category) {
            sql += ' WHERE category = $1';
            params.push(category);
        }

        sql += ' ORDER BY category, name';
        
        const drinks = await db.query(sql, params);
        res.json(drinks);
    } catch (err) {
        next(err);
    } 
});

// GET /menu/:id — get one drink
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id); //it comes from the URL itself, not after `?`
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'id ต้องเป็นตัวเลข' });
        }
        
        const drinks = await db.query(
            'SELECT * FROM drinks WHERE id = $1',
            [id]
        );
        
        if (drinks.length === 0) {
            return res.status(404).json({ error: 'Drink not found' });
        }
        
        res.json(drinks[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;