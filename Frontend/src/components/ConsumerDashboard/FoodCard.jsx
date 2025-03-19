// src/components/ConsumerDashboard/FoodCard.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";

const FoodCard = ({ food, onAccept, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative h-48">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              food.isVeg
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-3">{food.description}</p>

        <div className="flex items-center text-gray-500 text-sm mb-1">
          <Users className="h-4 w-4 mr-1" />
          <span>Serves {food.people}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>Until {food.availableUntil}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{food.restaurant}</span>
          <span className="mx-2">•</span>
          <span>{food.distance} km away</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAccept}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-300"
        >
          Request Food
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FoodCard;