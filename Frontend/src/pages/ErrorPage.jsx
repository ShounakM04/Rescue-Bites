import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AlertCircle, Home } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center pt-24 px-4 text-center"
      >
        <div className="bg-red-100 p-6 rounded-full mb-8">
          <AlertCircle className="h-16 w-16 text-red-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Please check the URL or return to the homepage.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors duration-300"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Homepage
          </Link>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-gray-400"
        >
          <span className="text-sm">Error code: 404</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;