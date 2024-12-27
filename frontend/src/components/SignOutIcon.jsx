import React from "react";
import signout from "../assets/utils/signout.svg";

const SignOutIcon = () => {
  return (
    <div className="absolute top-4 right-4">
      <img src={signout} alt="" />
    </div>
  );
};

export default SignOutIcon;
