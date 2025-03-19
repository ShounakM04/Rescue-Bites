import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Header from "../components/ConsumerDashboard/Header";
import Tabs from "../components/ConsumerDashboard/Tabs";
import SearchAndFilter from "../components/ConsumerDashboard/SearchAndFilter";
import FoodCard from "../components/ConsumerDashboard/FoodCard";
import AcceptedRequestCard from "../components/ConsumerDashboard/AcceptedRequestCard";
import ConfirmationModal from "../components/ConsumerDashboard/ConfirmationModal";
import SkeletonLoading from "../components/ConsumerDashboard/SkeletonLoading";
import ErrorDisplay from "../components/ConsumerDashboard/ErrorDisplay";
import NoResults from "../components/ConsumerDashboard/NoResults";
import { getUserLocation } from "../utils/getUserLocation";
import { calculateDistance } from "../utils/calculateDistance";
import { AlertCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import MapView from "../components/MapView";
const ConsumerDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVeg, setFilterVeg] = useState(null);
  const [availableFoodListings, setAvailableFoodListings] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  
  // Fetch food listings
  const fetchFoodListings = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const pincode = decodedToken.pincode;
    try {
      const userLocation = await getUserLocation();
      const response = await axios.get("http://localhost:8000/foodDetails/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params:{
          pincode
        }
      });

      if (response.data.success) {
        console.log(response.data)
        const transformedData = response.data.data.map((item) => {
          const hasValidCoordinates =
            item.location &&
            Array.isArray(item.location.coordinates) &&
            item.location.coordinates.length === 2;

          const formattedLocation = hasValidCoordinates
            ? `${item.location.coordinates[1].toFixed(4)}, ${item.location.coordinates[0].toFixed(4)}`
            : "Location not available";

          const listingLocation = hasValidCoordinates
            ? {
                latitude: item.location.coordinates[1],
                longitude: item.location.coordinates[0],
              }
            : null;

          const distance = listingLocation
            ? calculateDistance(userLocation, listingLocation)
            : "Distance not available";

          return {
            id: item._id,
            name: item.food_name,
            restaurant: item.restaurant_name,
            description: item.description || "No description available.",
            people: item.people_count,
            isVeg: item.veg,
            availableUntil: new Date(item.expiration_time).toLocaleTimeString(),
            location: formattedLocation,
            distance,
            image:
              item.images.length > 0
                ? item.images[0]
                : "https://via.placeholder.com/150",
          };
        });

        setAvailableFoodListings(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch food listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodListings();
  }, []);

  const handleAcceptRequest = (food) => {
    setSelectedFood(food);
    setShowConfirmation(true);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        toast.success(data.message); // Show hot toast notification
        setNotifications((prev) => [...prev, data.message]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);
  
  const confirmAcceptRequest = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/booking/book",
        {
          foodListingId: selectedFood.id,
          peopleBooked: peopleCount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setAvailableFoodListings((prev) =>
          prev.map((item) =>
            item.id === selectedFood.id
              ? {
                  ...item,
                  people: item.people - peopleCount,
                  status: item.people - peopleCount <= 0 ? "claimed" : "active",
                }
              : item
          )
        );
        setAcceptedRequests((prev) => [...prev, response.data.data.booking]);
        setShowConfirmation(false);
        setSelectedFood(null);
        toast.success("Food booked successfully!");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.error || "Failed to process booking");
    }
  };

  // Filter available food listings based on search and veg filter
  const filteredFoodListings = availableFoodListings.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVegFilter = filterVeg === null || item.isVeg === filterVeg;

    return matchesSearch && matchesVegFilter;
  });

  const fetchAcceptedRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/booking/book", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAcceptedRequests(response.data.data);
      }
    } catch (error) {
      if(response.data.data.size == 0){
        setError("No Listings Available nearby");
        toast.error("No Listings Available nearby. Please try again later.");
      }
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings. Please try again later.");
      toast.error("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-12">
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "available" && (
          <>
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterVeg={filterVeg}
              setFilterVeg={setFilterVeg}
            />

            {loading ? (
              <SkeletonLoading />
            ) : error ? (
              <ErrorDisplay error={error} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFoodListings.length > 0 ? (
                  filteredFoodListings.map((food, index) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      onAccept={() => handleAcceptRequest(food)}
                      delay={index * 0.1}
                    />
                  ))
                ) : (
                  <NoResults />
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "accepted" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {acceptedRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acceptedRequests.map((request, index) => (
                <AcceptedRequestCard
                  key={request._id}
                  request={request}
                  delay={index * 0.1}
                />
              ))}
            </div>
            ) : (
              <div className="py-12 text-center bg-white rounded-xl shadow-sm">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No accepted requests yet
              </h3>
              <p className="text-gray-500 mb-6">
                Browse available food and make your first request
              </p>
              <button
                onClick={() => setActiveTab("available")}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-300"
              >
                Browse Available Food
              </button>
            </div>
            )}
          </motion.div>
        )}
      </div>

      <ConfirmationModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        selectedFood={selectedFood}
        confirmAcceptRequest={confirmAcceptRequest}
        peopleCount={peopleCount}
        setPeopleCount={setPeopleCount}
      />
    </div>
  );
};

export default ConsumerDashboard;