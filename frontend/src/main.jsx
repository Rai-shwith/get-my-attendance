import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import Background from "./components/Background.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { MessageProvider } from "./contexts/MessageContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <MessageProvider>
        <ThemeProvider>
          <Background>
            <ThemeToggle />
              <App />
          </Background>
        </ThemeProvider>
      </MessageProvider>
    </LoadingProvider>
  </StrictMode>
);
