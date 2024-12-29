import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const {theme,toggleTheme} = useTheme();
  return (
    <div className="absolute z-10 top-5 right-5 flex items-center">
      <input
        type="checkbox"
        className="hidden"
        id="toggle"
        checked={theme.theme === "dark"}
        onChange={toggleTheme}
      />
      <label
        htmlFor="toggle"
        className={`flex items-center cursor-pointer w-16 h-8 rounded-full transition-colors duration-300 ease-in-out bg-gradient-to-r from-gray-500 dark:from-gray-800 dark:to-purple-600 to-purple-800`}
      >
        <span
          className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out transform dark:translate-x-0 translate-x-8"
        />
      </label>
    </div>
  );
};

export default ThemeToggle;
