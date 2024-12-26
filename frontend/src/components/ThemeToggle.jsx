import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed top-5 right-5 flex items-center">
      <input
        type="checkbox"
        className="hidden"
        id="toggle"
        checked={theme === "light"}
        onChange={toggleTheme}
      />
      <label
        htmlFor="toggle"
        className={`flex items-center cursor-pointer w-16 h-8 rounded-full transition-colors duration-300 ease-in-out bg-gradient-to-r from-gray-500 dark:from-gray-800 dark:to-purple-600 to-purple-800`}
      >
        <span
          className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
            theme === "light" ? "transform translate-x-8" : ""
          }`}
        />
      </label>
    </div>
  );
};

export default ThemeToggle;
