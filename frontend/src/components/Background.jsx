// Example: src/components/Background.jsx
import { useTheme } from "../contexts/ThemeContext";

const Background = ({ children }) => {
  const {theme} = useTheme();
  return <div className={`min-h-svh w-full ${theme.background}`}>{children}</div>;
};

export default Background;
