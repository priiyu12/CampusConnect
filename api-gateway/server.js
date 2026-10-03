const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Service Registry via Configuration
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

// Request Logging
app.use(morgan(':method :url -> :status (Targeting Backend)'));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is up and running' });
});

// Centralized Error Handling for unreachable services (502 Bad Gateway)
const onError = (err, req, res) => {
    console.error('Proxy Error:', err.message);
    res.status(502).json({ error: 'Bad Gateway: Backend service is unreachable or returned an error.' });
};

// Route Configuration
app.use('/users', createProxyMiddleware({ 
    target: USER_SERVICE_URL, 
    changeOrigin: true,
    onError 
}));

app.use('/products', createProxyMiddleware({ 
    target: PRODUCT_SERVICE_URL, 
    changeOrigin: true,
    onError 
}));

app.use('/orders', createProxyMiddleware({ 
    target: ORDER_SERVICE_URL, 
    changeOrigin: true,
    onError 
}));

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
