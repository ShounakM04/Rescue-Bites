// src/components/ConsumerDashboard/ConfirmationModal.jsx
import { Users, Clock, AlertCircle, ThumbsUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";



const ConfirmationModal = ({
  showConfirmation,
  setShowConfirmation,
  selectedFood,
  confirmAcceptRequest,
  peopleCount,
  setPeopleCount,
}) => {
  return (
    <AnimatePresence>
      {showConfirmation && selectedFood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">
                  {selectedFood.name}
                </h3>
                <p className="text-white text-sm opacity-90">
                  {selectedFood.restaurant}
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Your Request
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3 text-gray-500" />
                  <span>
                    Serves approximately {selectedFood.people} people
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Available until {selectedFood.availableUntil}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-yellow-600" />
                  <p className="text-sm">
                    By accepting this food, you commit to picking it up at the
                    specified location before the available time.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of people to feed
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedFood?.people || 1}
                  value={peopleCount}
                  onChange={(e) =>
                    setPeopleCount(Math.min(e.target.value, selectedFood.people))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={confirmAcceptRequest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Confirm Request
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;