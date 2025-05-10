const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

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
  productId: String,
  rating: Number,
  comment: String
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password, isVerified: true });
  if (user) {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false, message: 'Invalid credentials or not verified.' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otpToken: otp });
  if (user) {
    user.isVerified = true;
    user.otpToken = null;
    await user.save();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await User.updateOne({ email }, { otpToken: otp });
  console.log(`OTP for ${email}: ${otp}`);
  res.sendStatus(200);
});

app.post('/product', async (req, res) => {
  try {
    const createdProduct = await Product.create(req.body);
    res.json({ success: true, productId: createdProduct._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post("/api/review", async (req, res) => {
  const { productId, rating, comment } = req.body;
  await Review.create({ productId, rating: parseInt(rating), comment });
  res.json({ success: true, message: "Review submitted." });
});

app.get("/api/review/average/:productId", async (req, res) => {
  const productId = req.params.productId;
  const reviews = await Review.find({ productId });
  if (reviews.length === 0) return res.json({ averageRating: 0 });
  const total = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
  const averageRating = total / reviews.length;
  res.json({ averageRating: parseFloat(averageRating.toFixed(1)) });
});

app.listen(PORT, () => {
  console.log(`Selby Server running at http://localhost:${PORT}`);
});
