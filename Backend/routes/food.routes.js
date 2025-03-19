import express from 'express';
import * as foodController from '../controllers/foodController.js';
import {authenticateToken} from '../middlewares/auth.js'
const router = express.Router();
import uploadMiddleware from '../middlewares/uploadMiddleware.js';

// Create new food listing
router.post('/', uploadMiddleware('food_images').single('image'), authenticateToken, foodController.createFoodListing);

// Get all active listings with pagination
router.get('/', authenticateToken, foodController.getFoodListings);

// Get nearby food listings
router.get('/nearby', authenticateToken, foodController.getNearbyFoodListings);

router.get('/metrics', authenticateToken,foodController.getMetrics);

// Get a single listing by ID
router.get('/:id', authenticateToken, foodController.getFoodListingById);

// Update listing status
router.patch('/:id/status', authenticateToken, foodController.updateListingStatus);

// Search food listings
router.get('/search', authenticateToken, foodController.searchFoodListings);

// Get popular listings
router.get('/popular', authenticateToken, foodController.getPopularListings);

// Update listing
router.put('/:id', authenticateToken, foodController.updateFoodListing);

// Delete listing
router.delete('/:id', authenticateToken, foodController.deleteFoodListing);


export default router;
