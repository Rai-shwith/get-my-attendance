import React from "react";
import { useLoading } from "../contexts/LoadingContext";

const LoadingBar = () => {
  const { loading } = useLoading();

  return loading ? (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-purple-600 text-2xl animate-spin flex items-center justify-center border-t-purple-600 rounded-full"></div>
        </div>
      </div>
    </div>
  ) : null;
};

export default LoadingBar;
