const Review = require('../models/reviewModel');

exports.submitReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const review = new Review({ productId, rating, comment });
        await review.save();
        res.json({ success: true, message: 'Review submitted' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        const avg = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        res.json({ success: true, averageRating: avg });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
