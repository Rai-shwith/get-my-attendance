import React from "react";
import logoLight from "../assets/logo/logoLight.svg";
import logoDark from "../assets/logo/logoDark.svg"
import { useTheme } from "../contexts/ThemeContext";
import LoadingBar from "./LoadingBar";
const DisplayLogo = () => {
  const {theme} = useTheme();
  return (
    <div className="-mt-6 mb-6">
      <img src={theme.theme ==="dark" ? logoDark: logoLight } alt="Logo" />
      <LoadingBar />
    </div>
  );
};

export default DisplayLogo;
