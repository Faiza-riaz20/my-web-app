const express = require('express');
const mysql = require('mysql2');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
});

app.get('/', (req, res) => {
  res.send('<h1>Hello from My Web App!</h1><p>CI/CD Pipeline: Jenkins + Docker + Kubernetes</p>');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
