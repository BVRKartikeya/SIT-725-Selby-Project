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

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists." });

    await User.create({ name, email, password });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign({ otp }, SECRET_KEY, { expiresIn: '5m' });

  await User.findOneAndUpdate({ email }, { otpToken: token });
  console.log(`OTP for ${email}: ${otp}`);
  res.json({ success: true });
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user?.otpToken) return res.status(400).json({ success: false });

  try {
    const decoded = jwt.verify(user.otpToken, SECRET_KEY);
    if (decoded.otp === otp) {
      user.isVerified = true;
      user.otpToken = null;
      await user.save();
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, message: "Incorrect OTP" });
  } catch {
    res.status(401).json({ success: false, message: "OTP expired or invalid" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password, isVerified: true });
  if (!user) return res.status(401).json({ success: false });

  res.json({ success: true });
});

app.post('/product', async (req, res) => {
  const { title, price, photo, ownerEmail } = req.body;
  if (!title || !price || !photo || !ownerEmail)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const newProduct = await Product.create({ title, price, photo, ownerEmail });
  console.log(" New product listed:", newProduct);
  res.json({ success: true });
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(PORT, () => console.log(` Selby Server running at http://localhost:${PORT}`));
