const express = require('express');

const app = express();
const PORT = 3000;

// Middleware: parse JSON body
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Coffee Shop API',
        version: '1.0.0'
    });
});

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.json({ message: `Hello, ${name}!` });
});

app.get('/menu', (req, res) => {
  res.json([
    { id: 1, name: 'Espresso', price: 50},
    { id: 2, name: 'Latte', price: 70},
    { id: 3, name: 'Cappuccino', price: 70},
  ]);
});

app.get('/time', (req, res) =>{
  res.json({time: new Date().toISOString()});
});

app.get('/random', (req, res) => {
  const number = Math.floor(Math.random() * 100) +1;
  res.json({ number: number });
});

app.get('/square/:num', (req, res) => {
    const n = parseInt(req.params.num);
    res.json({ input: n, result: n * n });
});

app.get('/greet/:name',(req, res) =>{
  const name = req.params.name;
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  res.json({ greeting: `${greeting}, ${name}!`});
})
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});