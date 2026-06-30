const express = require('express');
const db = require('../db');
const asyncHandler = require('../middleware/asyncHandler');
const {validateId} = require('../middleware/validator');

const router = express.Router();

// GET /menu — list all drinks
router.get('/', asyncHandler(async(req, res) => {
    const category = req.query.category;
    let sql = 'SELECT * FROM drinks';
    const params = [];

    if (category) {
        sql += ' WHERE category = $1';
        params.push(category);
    }

    sql += ' ORDER BY category, name';

    const drinks = await db.query(sql, params);
    res.json(drinks);
}));

// GET /menu/:id — get one drink
router.get('/:id', 
    validateId,
    asyncHandler(async (req, res) => {
    const id = req.params.id;
    
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
}));

module.exports = router;