"use client";

import React from "react";

const Header = () => {
  return (
    <div className="w-full py-12 mt-[5vw]">
      <h1 className="text-5xl font-bold animate-gradient-shine text-gray-200 text-center">
        Welcome to{" "}
        <span className="text-gradient animate-gradient-shine cursor-default">
          BrainyBox
        </span>
      </h1>
    </div>
  );
};

export default Header;