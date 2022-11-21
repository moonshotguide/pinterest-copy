import React from "react";
import { Circles, ThreeCircles } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <ThreeCircles
        color={ document.documentElement.classList == "dark" ? '#00BFFF' : '#F03200'}
        height={50} 
        width={200}
        className="m-5"
      />
      <p className="text-lg text-white text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
