const User = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.json({ success: false, message: 'Invalid credentials' });
        if (!user.isVerified) return res.json({ success: false, message: 'Email not verified' });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
