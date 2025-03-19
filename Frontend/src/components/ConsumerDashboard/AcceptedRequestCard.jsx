import { Calendar, MapPin, Users, X } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import MapView from "../MapView";

const AcceptedRequestCard = ({ request, delay }) => {
  const [showMap, setShowMap] = useState(false);

  const {
    foodListing: {
      food_name,
      restaurant_name,
      veg,
      expiration_time,
      location,
      images,
    } = {},
    peopleBooked,
    status,
  } = request || {};

  return (
    <>
      {/* Card Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex">
          <div className="w-1/3">
            <img
              src={images?.length > 0 ? images[0] : "https://via.placeholder.com/150?text=No+Image"}
              alt={food_name || "Food Image"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-2/3 p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-gray-800">{food_name}</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === "ready"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {status === "ready" ? "Ready for Pickup" : "Confirmed"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{restaurant_name}</p>

            <div className="space-y-1 mb-3">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Pickup: {new Date(expiration_time).toLocaleString()}</span>
              </div>
              {/* <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {location?.coordinates?.length === 2 ? (
                  <span>
                    {parseFloat(location.coordinates[1]).toFixed(4)},{" "}
                    {parseFloat(location.coordinates[0]).toFixed(4)}
                  </span>
                ) : (
                  <span>Location not available</span>
                )}
              </div> */}
              <div className="flex items-center text-gray-500 text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>Serves {peopleBooked}</span>
                <span className="mx-2">•</span>
                <span className={veg ? "text-green-600" : "text-red-600"}>
                  {veg ? "Vegetarian" : "Non-Vegetarian"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors duration-200">
                View Details
              </button>
              <button
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                onClick={() => setShowMap(true)}
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Modal */}
      {showMap && location?.coordinates?.length === 2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowMap(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Directions</h3>
            <MapView
              latitude={parseFloat(location.coordinates[1]).toFixed(4)}
              longitude={parseFloat(location.coordinates[0]).toFixed(4)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AcceptedRequestCard;
