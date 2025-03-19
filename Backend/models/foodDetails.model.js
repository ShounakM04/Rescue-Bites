// const mongoose = require("mongoose");
const { Schema } = mongoose;
import mongoose from "mongoose";
const validateCoordinates = (coords) => {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords[0] >= -180 &&
    coords[0] <= 180 &&
    coords[1] >= -90 &&
    coords[1] <= 90
  );
};

const foodDetailsSchema = new Schema(
  {
    restaurant_name: { 
      type: String, 
      required: [true, "Restaurant name is required"],
      index: true,
      maxlength: [100, "Restaurant name cannot exceed 100 characters"]
    },
    veg: { 
      type: Boolean, 
      required: [true, "Vegetarian status is required"] 
    },
    food_name: { 
      type: String, 
      required: [true, "Food name is required"],
      index: true,
      maxlength: [200, "Food name cannot exceed 200 characters"]
    },
    people_count: {   
      type: Number, 
      required: [true, "People count is required"],
      min: [1, "Must serve at least 1 person"],
      max: [1000, "Cannot serve more than 1000 people"]
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "provider",
      required: [true, "Provider reference is required"],
      index: true
    },
    request_time: {
      type: Date,
      default: Date.now
    },
    expiration_time: {
      type: Date,
      required: [true, "Expiration time is required"],
      validate: {
        validator: function(v) {
          return v > this.request_time;
        },
        message: "Expiration time must be after request time"
      }
    },
    status: {
      type: String,
      enum: {
        values: ["active", "claimed", "expired", "cancelled"],
        message: "Invalid status value"
      },
      default: "active",
      index: true
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        required: [true, "Coordinates are required"],
        validate: {
          validator: validateCoordinates,
          message: "Invalid coordinates format [longitude, latitude]"
        }
      }
    },
    preparation_time: {
      type: Date,
      validate: {
        validator: function(v) {
          return v <= this.request_time;
        },
        message: "Preparation time cannot be after request time"
      }
    },
    pickup_instructions: {
      type: String,
      maxlength: [500, "Pickup instructions cannot exceed 500 characters"]
    },
    images: [{
      type: String,
    }],
    view_count: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    time_to_claim: {
      type: Number,
      min: 0
    },
    description:String
  }, 
  {
    timestamps: { 
      createdAt: "listed_at", 
      updatedAt: "updated_at" 
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
foodDetailsSchema.index({ location: "2dsphere" });
foodDetailsSchema.index({ expiration_time: 1 });
foodDetailsSchema.index({ food_name: "text", restaurant_name: "text" });

// Virtuals
foodDetailsSchema.virtual("time_remaining").get(function() {
  return this.expiration_time - Date.now();
});

foodDetailsSchema.virtual("is_available").get(function() {
  return this.status === "active" && this.expiration_time > new Date();
});

// Pre-save hooks
foodDetailsSchema.pre("save", function(next) {
  if (this.isModified("status") && this.status === "claimed") {
    this.time_to_claim = Date.now() - this.listed_at;
  }
  
  if (this.expiration_time < new Date()) {
    this.status = "expired";
  }
  
  next();
});

// Query helpers
foodDetailsSchema.query.active = function() {
  return this.where({ status: "active" })
            .where("expiration_time").gt(Date.now());
};

foodDetailsSchema.query.nearLocation = function(coordinates, maxDistance = 5000) {
  return this.where("location").near({
    center: coordinates,
    spherical: true,
    maxDistance
  });
};

// Static methods
foodDetailsSchema.statics.getPopularFoods = function(limit = 10) {
  return this.aggregate([
    { $sort: { view_count: -1 } },
    { $limit: limit },
    { $project: { food_name: 1, view_count: 1, restaurant_name: 1 } }
  ]);
};

const FoodDetails = mongoose.model("FoodDetails", foodDetailsSchema);

export default FoodDetails