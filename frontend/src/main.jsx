import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { AuthProvider } from "../api/authContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Background from "./components/Background.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { ErrorMessageProvider } from "./contexts/ErrorMessageContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <ErrorMessageProvider>
        <ThemeProvider>
          <Background>
            <ThemeToggle />
            <AuthProvider>
              <App />
            </AuthProvider>
          </Background>
        </ThemeProvider>
      </ErrorMessageProvider>
    </LoadingProvider>
  </StrictMode>
);
