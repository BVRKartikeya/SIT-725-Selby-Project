const User = require('../models/userModel');
const otpService = require('../utils/sendOtp');

exports.sendOtp = (req, res) => {
    const { email } = req.body;
    const otp = otpService.sendOtp(email);
    console.log(`OTP for ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP sent' });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (otpService.verifyOtp(email, otp)) {
        await User.findOneAndUpdate({ email }, { isVerified: true });
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid or expired OTP' });
    }
};
