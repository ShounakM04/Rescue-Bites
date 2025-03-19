import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { ArrowRight } from "lucide-react";

function Home() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    handleLoad(); // Trigger handleLoad directly when component mounts
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  const handleLoad = () => {
    window.scrollTo(0, 0);

    if (!isScrolling) {
      const scrollPosition = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (scrollPosition === maxScroll) {
        window.scrollTo(0, 0);
      }
    }
  };

  const handleClick = () => {
    const windowHeight = window.innerHeight;
    const scrollDuration = 500;
    smoothScroll(windowHeight, scrollDuration);
  };

  const smoothScroll = (targetHeight, duration) => {
    setIsScrolling(true);
    const start = window.scrollY;
    const distance = targetHeight - start;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsedTime = currentTime - startTime;
      const scrollProgress = easeInOutQuad(elapsedTime, start, distance, duration);
      window.scrollTo(0, scrollProgress);
      if (elapsedTime < duration) {
        requestAnimationFrame(step);
      } else {
        setIsScrolling(false);
      }
    }

    requestAnimationFrame(step);
  };

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 md:pt-32 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M125,-160.4C159.9,-146.7,184.6,-107.3,197.4,-64.2C210.2,-21.1,211.2,25.9,193.8,62.4C176.4,99,140.6,125.1,103.9,147.4C67.2,169.7,29.5,188.2,-8.4,198.4C-46.3,208.7,-84.4,210.7,-122.7,194.1C-161,177.5,-199.5,142.3,-215.9,99.4C-232.3,56.5,-226.6,5.9,-212.8,-41.3C-199,-88.5,-177.1,-132.3,-142.2,-146C-107.3,-159.7,-59.4,-143.3,-13.4,-127.8C32.6,-112.3,90.1,-174.1,125,-160.4Z" fill="#047857" />
            </g>
          </svg>
        </div>
        
        {/* Text Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-12 mt-24 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight max-w-xl">
            Reduce Food Waste, Feed More People
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg">
            A platform dedicated to reducing food waste by connecting restaurants with surplus food to users who can benefit from it.
          </p>
          <button 
            onClick={handleClick}
            className="mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 mt-6">
          <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" 
            alt="Food waste reduction" 
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16 mt-44">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to reduce food waste and help those in need
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl font-bold text-emerald-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Restaurants List Surplus</h3>
            <p className="text-gray-600 text-center">
              Restaurants and food businesses list their surplus food that would otherwise go to waste.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl font-bold text-emerald-600">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Users Browse & Reserve</h3>
            <p className="text-gray-600 text-center">
              Users browse available food items and reserve what they need at discounted prices.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl font-bold text-emerald-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Pickup & Enjoy</h3>
            <p className="text-gray-600 text-center">
              Users pick up their reserved food items at the specified time, reducing waste and saving money.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Restaurants */}
      <div className="py-16 px-4 md:px-8 lg:px-16 bg-gray-100 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Restaurants</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These restaurants are leading the way in reducing food waste
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Restaurant 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Restaurant" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Green Plate Bistro</h3>
              <p className="text-gray-600 mb-4">
                Farm-to-table restaurant with a focus on sustainable practices and zero waste.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-600 font-semibold">4 items available</span>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  View Menu
                </button>
              </div>
            </div>
          </div>
          
          {/* Restaurant 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Restaurant" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Urban Harvest Kitchen</h3>
              <p className="text-gray-600 mb-4">
                Modern cuisine with a commitment to reducing food waste through creative cooking.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-600 font-semibold">7 items available</span>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  View Menu
                </button>
              </div>
            </div>
          </div>
          
          {/* Restaurant 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Restaurant" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sustainable Spoon</h3>
              <p className="text-gray-600 mb-4">
                Family-owned restaurant dedicated to community support and environmental responsibility.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-600 font-semibold">5 items available</span>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  View Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Section */}
      <div className="py-24 px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we're making a difference in our communities and environment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-4xl font-bold text-emerald-600 mb-2">5,280+</h3>
            <p className="text-gray-700 font-medium">Meals Saved</p>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-4xl font-bold text-emerald-600 mb-2">127+</h3>
            <p className="text-gray-700 font-medium">Partner Restaurants</p>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-4xl font-bold text-emerald-600 mb-2">2,400+</h3>
            <p className="text-gray-700 font-medium">CO₂ Emissions Reduced (kg)</p>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter to stay updated on our latest initiatives and success stories
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RescueBites</h3>
            <p className="text-gray-400 mb-4">
              Reducing food waste, one meal at a time.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Restaurants</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Join as Partner</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Login</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@RescueBites.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Green Street, Eco City</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 RescueBites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;