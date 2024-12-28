import React from "react";
import logoLight from "../assets/logo/logoLight.svg";
import logoDark from "../assets/logo/logoDark.svg"
import { useTheme } from "../contexts/ThemeContext";
const DisplayLogo = () => {
  const {theme} = useTheme();
  return (
    <div className="-mt-6 mb-6 w-32">
      <img src={theme.theme ==="dark" ? logoDark: logoLight } 
      alt="Logo" 
      className="w-full h-auto object-contain"/>
    </div>
  );
};

export default DisplayLogo;
