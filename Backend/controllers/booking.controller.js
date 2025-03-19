import Booking from "../models/booking.model.js";
import FoodDetails from "../models/foodDetails.model.js";
import mongoose from "mongoose";


export const createBooking = async (req, res) => {
  try {
    const { foodListingId, peopleBooked } = req.body;
    const consumerId = req.user.consumerId;

    // Debug logs
    // console.log("\n=== NEW BOOKING ATTEMPT ===");
    // console.log("Food Listing ID:", foodListingId);
    // console.log("Consumer ID:", consumerId);
    // console.log("Server time:", new Date());

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(foodListingId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid food listing ID format"
      });
    }

    // Find food listing
    const foodListing = await FoodDetails.findOne({
      _id: foodListingId,
      status: "active",
    }).lean();

    // console.log("Query conditions:", {
    //   _id: foodListingId,
    //   status: "active",
    //   expiration_time: { $gt: new Date() }
    // });

    console.log("Found listing:", foodListing);

    if (!foodListing) {
      // Check if listing exists at all
      const exists = await FoodDetails.exists({ _id: foodListingId });
      // console.log("Listing exists:", exists);

      // Check expiration_time
      const listing = await FoodDetails.findById(foodListingId).lean();
      // console.log("Listing expiration_time:", listing.expiration_time);
      // console.log("Is expiration_time valid?", listing.expiration_time > new Date());

      return res.status(404).json({
        success: false,
        error: "Food listing not available or expired",
        debug: {
          exists: exists,
          currentTime: new Date(),
          listingExpiration: listing?.expiration_time
        }
      });
    }

    // Check available portions
    if (foodListing.people_count < peopleBooked) {
      return res.status(400).json({
        success: false,
        error: `Only ${foodListing.people_count} portions remaining`
      });
    }

    // Atomic update for concurrency safety
    const updatedFood = await FoodDetails.findByIdAndUpdate(
      foodListingId,
      { $inc: { people_count: -peopleBooked } },
      { new: true }
    );

    // Create booking record
    const booking = await Booking.create({
      foodListing: foodListingId,
      consumer: consumerId,
      peopleBooked,
      status: "confirmed"
    });

    res.status(201).json({
      success: true,
      data: {
        booking,
        updatedFood
      }
    });

  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const getBookingsByConsumerId = async (req, res) => {
  try {
    const consumerId = req.user.consumerId;

    // Validate consumer ID format
    if (!mongoose.Types.ObjectId.isValid(consumerId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid consumer ID format",
      });
    }

    // Fetch all bookings for the consumer and populate the foodListing field with all details
    const bookings = await Booking.find({ consumer: consumerId })
      .populate({
        path: "foodListing", // Field to populate
        select: "-__v", // Exclude the __v field from the populated document
      })
      .sort({ createdAt: -1 }); // Sort by most recent bookings first

    // If no bookings found
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No bookings found for this consumer",
      });
    }

    // Return the bookings with populated foodListing details
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings. Please try again later.",
    });
  }
};
