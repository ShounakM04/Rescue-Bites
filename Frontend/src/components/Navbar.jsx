import React, { useState } from "react";
import { Menu, X, ShoppingBag, LogOut } from "lucide-react"; // Import LogOut icon
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { logout } from "../features/auth/authSlice"; // Import logout action

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Initialize navigate
  const { isAuthenticated, role } = useSelector((state) => state.auth); // Get authentication state

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="fixed z-50 w-[90%] flex items-center justify-between min-h-[90px] px-4 md:px-8">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          RescueBites
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center">
        <div className="mr-8">
          <Link
            to="/"
            className="mr-8 font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
          >
            Home
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                to="/consumer-auth"
                className="mr-8 font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Consumer
              </Link>
              <Link
                to="/provider-auth"
                className="mr-8 font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Provider
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link
              to={role === "consumer" ? "/consumer-dashboard" : "/provider-dashboard"}
              className="mr-8 font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            to=""
            className="mr-8 font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Logout Button (if authenticated) */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg p-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
            >
              Home
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/consumer-auth"
                  className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                >
                  Consumer
                </Link>
                <Link
                  to="/provider-auth"
                  className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                >
                  Provider
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link
                to={role === "consumer" ? "/consumer-dashboard" : "/provider-dashboard"}
                className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              to=""
              className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
            >
              Contact
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;