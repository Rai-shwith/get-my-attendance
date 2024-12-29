import React from "react";
import { useNavigate } from "react-router-dom";
import DisplayLogo from "../../components/DisplayLogo";
import SignOutIcon from "../../components/SignOutIcon";
import Button from "../../components/Button";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigation = (action) => {
        if (action === "signup") {
            navigate("/signup");
        } else if (action === "login") {
            navigate("/login");
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center h-screen">
          {/* <SignOutIcon /> */}
            <DisplayLogo />
            <h1 className="text-4xl font-bold mb-4 text-white text-center">Welcome to App</h1>
            <p className="text-lg mb-6 text-white">Please sign up or log in to continue</p>
            <div className="flex space-x-4">
                {/* <button
                    onClick={() => handleNavigation("signup")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
                <button
                    onClick={() => handleNavigation("login")}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                    Log In
                </button> */}
                <Button customBackground="bg-blue-500 hover:bg-blue-600" onClick={() => handleNavigation("signup")}>Sign Up</Button>
                <Button customBackground="bg-green-500 hover:bg-green-600" onClick={() => handleNavigation("login")}>Log In</Button>
            </div>
        </div>
    );
};

export default LandingPage;