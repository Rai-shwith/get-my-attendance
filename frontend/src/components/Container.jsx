import React from "react";

const Container = ({ children }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-[90vw] min-h-[50vh] bg-white bg-opacity-30 backdrop-blur-lg border border-white/30 p-4 rounded-lg shadow-lg">
      {children}
    </div>
  );
};

export default Container;
