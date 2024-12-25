import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "student") {
      navigate("/studentLanding");
    } else if (role === "teacher") {
      navigate("/hostLanding");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
      <p className="text-lg mb-6">Are you a student or a teacher?</p>
      <div className="flex space-x-4">
        <button
          onClick={() => handleRoleSelection("student")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Student
        </button>
        <button
          onClick={() => handleRoleSelection("teacher")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          Teacher
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
