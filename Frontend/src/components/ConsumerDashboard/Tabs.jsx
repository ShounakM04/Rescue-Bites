// src/components/ConsumerDashboard/Tabs.jsx
const Tabs = ({ activeTab, setActiveTab }) => {
    return (
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`py-3 px-6 font-medium text-sm ${
            activeTab === "available"
              ? "text-emerald-600 border-b-2 border-emerald-500"
              : "text-gray-500 hover:text-gray-700"
          } transition-colors duration-200`}
        >
          Available Food
        </button>
        <button
          onClick={() => setActiveTab("accepted")}
          className={`py-3 px-6 font-medium text-sm ${
            activeTab === "accepted"
              ? "text-emerald-600 border-b-2 border-emerald-500"
              : "text-gray-500 hover:text-gray-700"
          } transition-colors duration-200`}
        >
          My Accepted Requests
        </button>
      </div>
    );
  };
  
  export default Tabs;