// src/components/ConsumerDashboard/Header.jsx
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h1 className="text-3xl font-bold text-gray-800">Find Available Food</h1>
      <p className="text-gray-600 mt-1">
        Browse surplus food from restaurants near you
      </p>
    </motion.div>
  );
};

export default Header;