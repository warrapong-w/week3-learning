require('dotenv').config();
const express = require('express');

const menuRoutes = require('./routes/menu');           
const orderRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');
const reportRoutes = require('./routes/reports');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Coffee Shop API',
        version: '1.0.0',
        endpoints: [
            'GET    /menu',
            'GET    /menu/:id',
            'POST   /orders',
            'GET    /orders',
            'GET    /customers/:id',
            'GET    /reports/top',
            'GET    /reports/summary',
        ]
    });
});

// Mount routers
app.use('/menu', menuRoutes);          
app.use('/orders', orderRoutes); 
app.use('/customers', customersRoutes);   
app.use('/reports', reportRoutes);    

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Coffee Shop API running at http://localhost:${PORT}`);
});