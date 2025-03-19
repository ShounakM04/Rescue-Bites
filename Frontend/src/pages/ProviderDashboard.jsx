import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import {
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Utensils,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";

const ProviderDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [recentListings, setRecentListings] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsResponse, listingsResponse] = await Promise.all([
          axios.get("http://localhost:8000/foodDetails/metrics", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:8000/foodDetails?limit=3", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setMetrics(metricsResponse.data);
        setRecentListings(listingsResponse.data.data);
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`/api/food/${id}/status`, { status: newStatus });
      setRecentListings((prev) =>
        prev.map((listing) =>
          listing._id === id ? { ...listing, status: newStatus } : listing
        )
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="mb-4 md:mb-0">
            {isLoading ? (
              <>
                <Skeleton width={250} height={32} className="mb-2" />
                <Skeleton width={200} height={20} />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800">
                  Provider Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your food donations and track impact
                </p>
              </>
            )}
          </div>

          {isLoading ? (
            <Skeleton width={200} height={48} />
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/provider-dashboard/add-food"
                className="inline-flex items-center px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Food Item
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? Array(6)
                .fill()
                .map((_, index) => (
                  <SkeletonMetricCard key={index} delay={index * 0.1} />
                ))
            : [
                {
                  title: "Accepted Requests",
                  value: metrics.acceptedRequests,
                  icon: <CheckCircle className="h-8 w-8 text-green-500" />,
                  color: "bg-green-50 border-green-200",
                },
                {
                  title: "Pending Requests",
                  value: metrics.pendingRequests,
                  icon: <Clock className="h-8 w-8 text-yellow-500" />,
                  color: "bg-yellow-50 border-yellow-200",
                },
                {
                  title: "Rejected Requests",
                  value: metrics.rejectedRequests,
                  icon: <XCircle className="h-8 w-8 text-red-500" />,
                  color: "bg-red-50 border-red-200",
                },
                {
                  title: "Total Meals Saved",
                  value: metrics.totalMealsSaved,
                  icon: <Utensils className="h-8 w-8 text-emerald-500" />,
                  color: "bg-emerald-50 border-emerald-200",
                },
                {
                  title: "People Fed",
                  value: metrics.peopleFed,
                  icon: <Users className="h-8 w-8 text-blue-500" />,
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  title: "Active Listings",
                  value: metrics.activeListings,
                  icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
                  color: "bg-purple-50 border-purple-200",
                },
              ].map((metric, index) => (
                <MetricCard
                  key={metric.title}
                  {...metric}
                  delay={0.1 + index * 0.1}
                />
              ))}
        </div>

        {/* Recent Food Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            {isLoading ? (
              <Skeleton width={200} height={24} />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Food Listings
              </h2>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isLoading
                    ? Array(6)
                        .fill()
                        .map((_, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <Skeleton width={80} />
                          </th>
                        ))
                    : [
                        "Food Item",
                        "Restaurant",
                        "People",
                        "Type",
                        "Status",
                        "Listed",
                        "Provider",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading
                  ? Array(3)
                      .fill()
                      .map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array(6)
                            .fill()
                            .map((_, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <Skeleton
                                  width={
                                    cellIndex === 0
                                      ? 120
                                      : cellIndex === 3
                                      ? 100
                                      : 80
                                  }
                                />
                              </td>
                            ))}
                        </tr>
                      ))
                  : recentListings?.map((item) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 0.5)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.food_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {item.restaurant_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {item.people_count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.veg
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.veg ? "Vegetarian" : "Non-Vegetarian"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "active"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "claimed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="claimed">Claimed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(item.listed_at).toLocaleDateString()}
                          </div>
                        </td>
                        {/* Display Provider Name */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {item.provider?.name || "N/A"}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-md overflow-hidden text-white p-6"
        >
          {isLoading ? (
            <>
              <Skeleton width={200} height={28} className="mb-4" />
              <Skeleton count={2} className="mb-4" />
              <Skeleton width={180} height={40} />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Your Impact Summary</h2>
              <p className="mb-4">
                You've helped save{" "}
                <span className="font-bold">{metrics.totalMealsSaved} meals</span>{" "}
                from going to waste and fed approximately{" "}
                <span className="font-bold">{metrics.peopleFed} people</span> in
                need.
              </p>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium"
                >
                  View Detailed Impact Report
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// MetricCard and SkeletonMetricCard components remain the same...

const MetricCard = ({ title, value, icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`${color} border rounded-xl shadow-sm p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
};

const SkeletonMetricCard = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white border rounded-xl shadow-sm p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <Skeleton width={120} height={24} />
      <Skeleton width={32} height={32} circle />
    </div>
    <Skeleton width={80} height={32} />
  </motion.div>
);

export default ProviderDashboard;