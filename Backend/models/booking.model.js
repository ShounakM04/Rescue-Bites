import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  foodListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodDetails",
    required: true
  },
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consumer",
    required: true
  },
  peopleBooked: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);