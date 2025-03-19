// src/components/ConsumerDashboard/SearchAndFilter.jsx
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const SearchAndFilter = ({ searchQuery, setSearchQuery, filterVeg, setFilterVeg }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search by food name or restaurant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterVeg(true)}
          className={`px-4 py-2 rounded-lg border ${
            filterVeg === true
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-white border-gray-300 text-gray-700"
          } font-medium transition-colors duration-200 flex items-center`}
        >
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          Veg Only
        </button>
        <button
          onClick={() => setFilterVeg(false)}
          className={`px-4 py-2 rounded-lg border ${
            filterVeg === false
              ? "bg-red-50 border-red-500 text-red-700"
              : "bg-white border-gray-300 text-gray-700"
          } font-medium transition-colors duration-200 flex items-center`}
        >
          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
          Non-Veg
        </button>
        <button
          onClick={() => setFilterVeg(null)}
          className={`px-4 py-2 rounded-lg border ${
            filterVeg === null
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700"
          } font-medium transition-colors duration-200 flex items-center`}
        >
          <Filter className="h-4 w-4 mr-1" />
          All
        </button>
      </div>
    </motion.div>
  );
};

export default SearchAndFilter;