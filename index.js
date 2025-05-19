const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3000;
const SECRET_KEY = 'selby_secret';

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/selby', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otpToken: String,
  isVerified: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  photo: String,
  ownerEmail: String
});

const reviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.status(201).json({ success: true });
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  user.otpToken = otp;
  await user.save();

  console.log(`OTP for ${email}: ${otp}`);
  res.json({ success: true });
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otpToken !== otp) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otpToken = null;
  await user.save();

  res.json({ success: true });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false });
  }
});

app.post('/product', async (req, res) => {
  try {
    const { title, price, photo, ownerEmail } = req.body;
    const newProduct = new Product({ title, price, photo, ownerEmail });
    await newProduct.save();
    res.json({ success: true, productId: newProduct._id });
  } catch (err) {
    console.error('Product listing error:', err);
    res.status(500).json({ success: false, message: 'Failed to list product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

app.post('/api/price-suggestion', async (req, res) => {
  const { title, price } = req.body;

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    const matched = products.filter(p =>
      p.title.toLowerCase().includes(title.toLowerCase())
    );

    const prices = matched.map(p => parseFloat(p.price)).filter(p => !isNaN(p));

    if (prices.length > 0) {
      const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      res.json({ suggestedPrice: avg.toFixed(2), source: 'FakeStoreAPI' });
    } else {
      const fallbackPrice = parseFloat(price) * 1.1;
      res.json({ suggestedPrice: fallbackPrice.toFixed(2), fallback: true });
    }
  } catch (err) {
    console.error('Error contacting FakeStore API:', err);
    const fallbackPrice = parseFloat(price) * 1.1;
    res.json({ suggestedPrice: fallbackPrice.toFixed(2), fallback: true });
  }
});

app.post('/api/review', async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({ productId, rating, comment });
    await review.save();
    res.json({ success: true, message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

app.get('/api/review/average/:productId', async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ productId });
  const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
  res.json({ averageRating: avg.toFixed(2) });
});


app.get('/api/chat/users', async (req, res) => {
  try {
    const users = await Product.distinct("ownerEmail");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => console.log(`Selby Server running at http://localhost:${PORT}`));
