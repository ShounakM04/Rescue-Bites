import FoodDetails from "../models/foodDetails.model.js";
import Booking from '../models/booking.model.js';

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "food-listing-service",
  brokers: ["localhost:9092"], // Kafka broker address
});

const producer = kafka.producer();
// Helper function for pagination
// const paginatedResults = async (model, page, limit, query = {}) => {
//   const startIndex = (page - 1) * limit;

//   const results = {};
//   results.total = await model.countDocuments(query); // Use the query for counting
//   results.pages = Math.ceil(results.total / limit);

//   results.results = await model
//     .find(query) // Use the query for filtering
//     .limit(limit)
//     .skip(startIndex)
//     .populate("provider", "name email") // Populate provider details
//     .lean()
//     .exec();

//   return results;
// };
const paginatedResults = async (model, page, limit, query = {}, populateOptions = null) => {
  const startIndex = (page - 1) * limit;

  const results = {};
  results.total = await model.countDocuments(query); // Use the query for counting
  results.pages = Math.ceil(results.total / limit);

  let queryBuilder = model.find(query).limit(limit).skip(startIndex);

  if (populateOptions) {
    queryBuilder = queryBuilder.populate(populateOptions);
  }

  results.results = await queryBuilder.lean().exec();

  return results;
};
// Create new food listing
export const createFoodListing = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path: null
    const newListing = new FoodDetails({
      ...req.body,
      listed_at: new Date(),
      images: imageUrl ? [imageUrl] : (req.body.images || [])
    });

    const savedListing = await newListing.save();
    res.status(201).json({
      success: true,
      data: savedListing,
      fileUrl: imageUrl, // Return the URL explicitly if uploaded
    });
  } catch (error) {
    next(error);
  }
};

// Get all active listings with pagination
export const getFoodListings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { pincode } = req.query; // Get pincode from query params

    // Base query to exclude listings with people_count = 0
    const query = { people_count: { $gt: 0 } };

    // If pincode is provided, filter by provider's pincode
    if (pincode) {
      const foodListings = await FoodDetails.find(query)
        .populate({
          path: "provider",
          match: { pincode: pincode }, // Filter providers by pincode
        })
        .lean();

      // Filter out listings with null provider (pincode mismatch)
      const filteredListings = foodListings.filter(
        (listing) => listing.provider !== null
      );

      // Paginate the filtered results manually
      const startIndex = (page - 1) * limit;
      const paginatedListings = filteredListings.slice(
        startIndex,
        startIndex + limit
      );

      return res.json({
        success: true,
        count: paginatedListings.length,
        data: paginatedListings,
        pagination: {
          page,
          limit,
          total: filteredListings.length,
          pages: Math.ceil(filteredListings.length / limit),
        },
      });
    }

    // If no pincode is provided, return all listings
    const paginatedData = await paginatedResults(FoodDetails, page, limit, query);

    res.json({
      success: true,
      count: paginatedData.results.length,
      data: paginatedData.results,
      pagination: {
        page,
        limit,
        total: paginatedData.total,
        pages: paginatedData.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get nearby food listings
export const getNearbyFoodListings = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000, pincode } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        error: "Please provide longitude and latitude parameters",
      });
    }

    // Base query to exclude listings with people_count = 0
    const query = { people_count: { $gt: 0 } };

    // If pincode is provided, filter by provider's pincode
    if (pincode) {
      const listings = await FoodDetails.find(query)
        .nearLocation([parseFloat(longitude), parseFloat(latitude)], maxDistance)
        .active()
        .populate({
          path: "provider",
          match: { pincode: pincode }, // Filter providers by pincode
        })
        .lean();

      // Filter out listings with null provider (pincode mismatch)
      const filteredListings = listings.filter(
        (listing) => listing.provider !== null
      );

      return res.json({
        success: true,
        count: filteredListings.length,
        data: filteredListings,
      });
    }

    // If no pincode is provided, return all nearby listings
    const listings = await FoodDetails.find(query)
      .nearLocation([parseFloat(longitude), parseFloat(latitude)], maxDistance)
      .active()
      .populate("provider", "name email") // Populate provider details
      .lean();

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// Get single listing by ID
export const getFoodListingById = async (req, res, next) => {
  try {
    const listing = await FoodDetails.findOne({
      _id: req.params.id,
      people_count: { $gt: 0 }, // Exclude listings with people_count = 0
    })
      .populate("provider", "name email") // Populate provider details
      .lean();

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "Food listing not found or no servings remaining",
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// Update listing status
export const updateListingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["active", "claimed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const listing = await FoodDetails.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "Food listing not found",
      });
    }

    // Automatically set status to "claimed" if people_count reaches 0
    if (listing.people_count === 0) {
      listing.status = "claimed";
      await listing.save();
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// Search food listings
export const searchFoodListings = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Please provide a search query",
      });
    }

    const results = await FoodDetails.find(
      {
        $text: { $search: q },
        people_count: { $gt: 0 }, // Exclude listings with people_count = 0
      },
      { score: { $meta: "textScore" } }
    )
      .populate("provider", "name email") // Populate provider details
      .sort({ score: { $meta: "textScore" } });

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// Get popular listings
export const getPopularListings = async (req, res, next) => {
  try {
    const popular = await FoodDetails.getPopularFoods({ people_count: { $gt: 0 } }); // Exclude listings with people_count = 0
    res.json({
      success: true,
      count: popular.length,
      data: popular,
    });
  } catch (error) {
    next(error);
  }
};

// Update listing
export const updateFoodListing = async (req, res, next) => {
  try {
    const listing = await FoodDetails.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "Food listing not found",
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// Delete listing
export const deleteFoodListing = async (req, res, next) => {
  try {
    const listing = await FoodDetails.findByIdAndDelete(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "Food listing not found",
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getMetrics = async (req, res, next) => {
  try {
    const providerId = req.ProviderId; // Get provider ID from the authenticated request

    // console.log("Provider ID:", providerId); // Debug: Log the provider ID

    // Debug: Log the count of accepted requests
    const acceptedRequests = await Booking.countDocuments({ status: 'confirmed', provider: providerId });
    // console.log("Accepted Requests:", acceptedRequests);

    // Debug: Log the count of pending requests
    const pendingRequests = await Booking.countDocuments({ status: 'pending', provider: providerId });
    // console.log("Pending Requests:", pendingRequests);

    // Debug: Log the count of rejected requests
    const rejectedRequests = await Booking.countDocuments({ status: 'cancelled', provider: providerId });
    // console.log("Rejected Requests:", rejectedRequests);

    // Debug: Log the total meals saved
    const totalMealsSaved = await FoodDetails.aggregate([
      { $match: { provider: providerId } },
      { $group: { _id: null, total: { $sum: '$people_count' } } },
    ]).then((result) => (result.length > 0 ? result[0].total : 0));
    // console.log("Total Meals Saved:", totalMealsSaved);

    // Debug: Log the total people fed
    const peopleFed = await Booking.aggregate([
      { $match: { status: 'confirmed', provider: providerId } },
      { $group: { _id: null, total: { $sum: '$peopleBooked' } } },
    ]).then((result) => (result.length > 0 ? result[0].total : 0));
    // console.log("People Fed:", peopleFed);

    // Debug: Log the count of active listings
    const activeListings = await FoodDetails.countDocuments({
      provider: providerId,
      status: 'active',
    });
    // console.log("Active Listings:", activeListings);

    const metrics = {
      acceptedRequests,
      pendingRequests,
      rejectedRequests,
      totalMealsSaved,
      peopleFed,
      activeListings,
    };

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error); // Debug: Log any errors
    next(error);
  }
};
