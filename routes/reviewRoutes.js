const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/api/review', reviewController.submitReview);
router.get('/api/review/average/:productId', reviewController.getAverageRating);

module.exports = router;
