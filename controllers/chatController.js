const User = require('../models/userModel');

exports.getUserEmails = async (req, res) => {
    try {
        const users = await User.find({}, 'email');
        const emails = users.map(u => u.email);
        res.json({ success: true, users: emails });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
