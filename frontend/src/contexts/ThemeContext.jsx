// src/contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { lightTheme,darkTheme } from "../helpers/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    const currentTheme = theme === lightTheme ? "light" : "dark";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
