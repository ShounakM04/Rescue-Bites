import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Utensils, Users, Clock, MapPin, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

const AddFoodItem = () => {
  const navigate = useNavigate();
  const [isVeg, setIsVeg] = useState(true);
  const [peopleCount, setPeopleCount] = useState(5);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    restaurant_name: "",
    food_name: "",
    expiration_time: "",
    pickup_location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setImageUrl(response.data.fileUrl);
        console.log("Image URL", response.data.fileUrl)
      } else {
        setError("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        });
      },
      (err) => {
        setError("Unable to retrieve your location");
        console.error(err);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!location) {
      setError("Please enable location access");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const decodedToken = jwtDecode(token);
      const providerId = decodedToken.ProviderId;

      if (!providerId) {
        throw new Error("Provider ID not found in token.");
      }

      const payload = {
        ...formData,
        veg: isVeg,
        people_count: peopleCount,
        location,
        status: "active",
        provider: providerId,
        description: description,
        images: imageUrl ? [imageUrl] : [],
      };

      await axios.post("http://localhost:8000/foodDetails/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Payload being sent to backend:", payload);
      navigate("/provider-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-4"
        >
          <button
            onClick={() => navigate("/provider-dashboard")}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Food Item</h1>
            <p className="text-gray-600">List surplus food to help those in need</p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden md:w-3/5 h-[99%]"
          >
            <div className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Restaurant Name and Food Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="restaurant_name"
                        value={formData.restaurant_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
                      />
                      <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Item Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="food_name"
                        value={formData.food_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
                      />
                      <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Food Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsVeg(true)}
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        isVeg
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-300 text-gray-700"
                      } font-medium transition-colors duration-200`}
                    >
                      Vegetarian
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVeg(false)}
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        !isVeg
                          ? "bg-red-50 border-red-500 text-red-700"
                          : "bg-white border-gray-300 text-gray-700"
                      } font-medium transition-colors duration-200`}
                    >
                      Non-Vegetarian
                    </button>
                  </div>
                </div>

                {/* People Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of People (Approx. Servings)
                  </label>
                  <div className="relative">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-lg border border-gray-300 text-gray-700 transition-colors duration-200"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-16 text-center py-1 border-t border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setPeopleCount(peopleCount + 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-lg border border-gray-300 text-gray-700 transition-colors duration-200"
                      >
                        +
                      </button>
                      <div className="ml-3 flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-1" />
                        <span>People</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Time
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="expiration_time"
                        value={formData.expiration_time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pickup_location"
                        value={formData.pickup_location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
                    ></textarea>
                    <Info className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Food Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {imageUrl && (
                    <div className="mt-4">
                      <img
                        src={imageUrl}
                        alt="Uploaded Food"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Location and Submit */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="w-full md:w-3/5">
                    <button
                      type="button"
                      onClick={getLocation}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center"
                    >
                      {location ? "Location Acquired" : "Get Current Location"}
                    </button>
                  </div>

                  <div className="w-full md:w-2/5">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting}
                      className="w-full px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center transition-colors duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Food Listing
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:block md:w-2/5"
          >
            <div className="h-[95%] rounded-xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Food donation"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddFoodItem;