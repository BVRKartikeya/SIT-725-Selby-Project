const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, price, photo, ownerEmail } = req.body;
        const product = new Product({ title, price, photo, ownerEmail });
        await product.save();
        res.json({ success: true, productId: product._id });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.approveProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.getPriceSuggestion = async (req, res) => {
    try {
        const { title, price } = req.body;
        const suggestedPrice = price * 1.1; 
        res.json({ success: true, suggestedPrice });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
