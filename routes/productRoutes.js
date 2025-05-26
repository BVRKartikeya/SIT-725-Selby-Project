const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/api/products', productController.getAllProducts);
router.post('/product', productController.createProduct); 
router.delete('/api/products/:id', productController.deleteProduct);
router.post('/api/products/:id/approve', productController.approveProduct);
router.post('/api/price-suggestion', productController.getPriceSuggestion);

module.exports = router;