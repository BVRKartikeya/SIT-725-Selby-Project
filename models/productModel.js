const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    photo: String, 
    ownerEmail: String,
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Product', productSchema);
