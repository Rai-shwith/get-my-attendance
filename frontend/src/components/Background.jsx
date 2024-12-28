// Example: src/components/Background.jsx
import { useTheme } from "../contexts/ThemeContext";

const Background = ({ children }) => {
  const {theme} = useTheme();
  return <div className={`min-h-screen fixed top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2 ${theme.background}`}>{children}</div>;
};

export default Background;
