// src/components/ConsumerDashboard/NoResults.jsx
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const NoResults = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full py-12 text-center"
    >
      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        No food listings found
      </h3>
      <p className="text-gray-500">Try adjusting your search or filters</p>
    </motion.div>
  );
};

export default NoResults;