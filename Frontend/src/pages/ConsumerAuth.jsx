import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ArrowRight, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice";

const ConsumerAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpData, setSignUpData] = useState({
    name: "",
    mobile_number: "",
    email: "",
    pincode: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    mobile_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    const endpoint = isSignIn
      ? "http://localhost:8000/consumer/signin"
      : "http://localhost:8000/consumer/signup";

    const data = isSignIn ? signInData : signUpData;

    try {
      const response = await axios.post(endpoint, data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", response.data.data.token);
      
      dispatch(
        loginSuccess({
          role: "consumer",
          user: response.data.data.user,
        })
      );

      toast.success(isSignIn ? "Login Successful!" : "Registration Successful!", {
        duration: 1500,
      });

      setTimeout(() => {
        if (isSignIn) {
          navigate("/consumer-dashboard");
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Something went wrong";
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen transition-all duration-700"
    >
      <Navbar />

      <div className="pt-14 px-4 md:px-8 lg:px-16 max-w-3xl mx-auto">
        <motion.div
          key={isSignIn ? "signIn" : "signUp"}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isSignIn ? "Welcome Back!" : "Join Our Community"}
            </h2>
            <p className="text-gray-600">
              {isSignIn
                ? "Sign in to rescue delicious meals"
                : "Start saving food and money today"}
            </p>
          </motion.div>

          {isSignIn ? (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <FieldWithIcon
                label="Mobile Number"
                type="tel"
                Icon={Phone}
                name="mobile_number"
                value={signInData.mobile_number}
                onChange={handleSignInChange}
              />
              <FieldWithIcon
                label="Password"
                type="password"
                Icon={Lock}
                name="password"
                value={signInData.password}
                onChange={handleSignInChange}
              />

              <SubmitButton loading={loading} isSignIn={isSignIn} />
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldWithIcon
                  label="Full Name"
                  type="text"
                  Icon={User}
                  name="name"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                />
                <FieldWithIcon
                  label="Mobile Number"
                  type="tel"
                  Icon={Phone}
                  name="mobile_number"
                  value={signUpData.mobile_number}
                  onChange={handleSignUpChange}
                />
                <FieldWithIcon
                  label="Email"
                  type="email"
                  Icon={Mail}
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                />
                <FieldWithIcon
                  label="Pincode"
                  type="text"
                  Icon={MapPin}
                  name="pincode"
                  value={signUpData.pincode}
                  onChange={handleSignUpChange}
                />
              </div>
              <FieldWithIcon
                label="Password"
                type="password"
                Icon={Lock}
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
              />

              <SubmitButton loading={loading} isSignIn={isSignIn} />
            </motion.form>
          )}

          <ToggleAuthMode isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Reusable Components remain the same as before
// (FieldWithIcon, SubmitButton, ToggleAuthMode)
const FieldWithIcon = ({ label, type, Icon, name, value, onChange }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-10"
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  </motion.div>
);

const SubmitButton = ({ loading, isSignIn }) => (
  <motion.button
    type="submit"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center transition-all duration-300"
    disabled={loading}
  >
    {loading ? "Processing..." : isSignIn ? "Sign In" : "Create Account"}
    <ArrowRight className="ml-2 h-5 w-5" />
  </motion.button>
);

const ToggleAuthMode = ({ isSignIn, setIsSignIn }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center mt-6 text-gray-600"
  >
    {isSignIn ? "Don't have an account? " : "Already have an account? "}
    <button
      onClick={() => setIsSignIn(!isSignIn)}
      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300"
    >
      {isSignIn ? "Sign up instead" : "Sign in instead"}
    </button>
  </motion.p>
);


export default ConsumerAuth;