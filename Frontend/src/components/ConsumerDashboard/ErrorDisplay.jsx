// src/components/ConsumerDashboard/ErrorDisplay.jsx
const ErrorDisplay = ({ error }) => {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
      </div>
    );
  };
  
  export default ErrorDisplay;