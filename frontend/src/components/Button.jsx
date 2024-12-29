import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Button = ({
  text,
  customTextColor,
  customBackground,
  type = "button",
  onClick = null,
  extraClasses = "",
  children,
}) => {
  const { theme } = useTheme();
  const textColor = customTextColor || theme.buttonTextColor;
  const background = customBackground || theme.buttonBackground;
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 ${textColor} ${background} ${extraClasses} rounded-lg  transition duration-200`}
      type={type}
    >
      {children || text}
    </button>
  );
};

export default Button;
