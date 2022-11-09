import React, { useState, useRef, useEffect } from "react";
import { navLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logoWhite from "../assets/logowhite.png";
import logo from "../assets/logo.png";

const Sidebar = ({ user, closeToogle }) => {
  return (
    <div className="flex flex-col justify-between h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link 
        to="/" 
        className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
        >
          <img src={ document.documentElement.classList == "dark" ? logoWhite : logo } alt="logo" className="w-full" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
