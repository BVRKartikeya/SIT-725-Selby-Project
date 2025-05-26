const Product = require('../models/productModel');
const fetch = require('node-fetch');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { title, price, photo, ownerEmail } = req.body;
  try {
    const product = new Product({ title, price, photo, ownerEmail, status: 'pending' });
    await product.save();
    res.json({ success: true, productId: product._id });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });

    product.status = 'approved';
    await product.save();
    res.json({ success: true, message: 'Product approved' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

exports.getPriceSuggestion = async (req, res) => {
  const { title, price } = req.body;

  try {
    const apiRes = await fetch('https://fakestoreapi.com/products', { timeout: 5000 });
    const products = await apiRes.json();

    let suggestedPrice;
    const matched = products.find(p => p.title.toLowerCase().includes(title.toLowerCase()));

    if (matched) {
      suggestedPrice = matched.price;
    } else {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      suggestedPrice = randomProduct.price;
    }

    res.json({ success: true, suggestedPrice });
  } catch (err) {
    const fallbackPrice = price * 1.1;
    res.json({ success: true, suggestedPrice: fallbackPrice });
  }
};
