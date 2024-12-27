import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { AuthProvider } from "../api/authContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Background from "./components/Background.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <ThemeProvider>
        <Background>
          {/* <div className="bg-gradient-to-r from-blue-500 dark:from-gray-800 to-purple-600 dark:to-gray-900"> */}
          {/* <div className='bg-gradient-to-r from-gray-800 to-gray-900'> */}
          <ThemeToggle />
          {/* <AuthProvider> */}
          <App />
          {/* </AuthProvider> */}
          {/* </div> */}
        </Background>
      </ThemeProvider>
    </LoadingProvider>
  </StrictMode>
);
