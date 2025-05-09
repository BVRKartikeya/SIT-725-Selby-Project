const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
const SECRET_KEY = "selby_secret";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let otpStore = {}; 

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign({ otp }, SECRET_KEY, { expiresIn: '5m' });

  otpStore[email] = token;
  console.log(`OTP for ${email}: ${otp}`); 

  res.json({ message: "OTP sent", otp }); 
});

app.post('/verify-otp', (req, res) => {
  const { email, otp: userOtp } = req.body;
  const token = otpStore[email];
  if (!token) return res.status(400).json({ message: 'No OTP for this email' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.otp === userOtp) {
      delete otpStore[email];
      res.json({ success: true, message: "OTP verified" });
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(401).json({ message: "OTP expired or invalid" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
