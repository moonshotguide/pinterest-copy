import React, { useState, useRef, useEffect } from "react";
import { navLink, Link, NavLink } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import logoWhite from "../assets/logowhite2.png";
import logo from "../assets/logo2.png";

import { categories } from "../utils/data";

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-slate-600 dark:text-slate-400 hover:text-black hover:font-semibold dark:hover:text-white border-slate-400 transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 text-red-600 dark:text-sky-400 font-extrabold border-r-2 border-black dark:border-slate-400 transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {
  //close sidebar when something
  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
  }

  return (
    <div className="flex flex-col justify-between h-full overflow-y-scroll min-w-210 android:max-w-[15rem] tablet:max-w-xs laptop:max-w-sm desktop:max-w-sm hide-scrollbar bg-sd_l_bg_primary_2 dark:bg-gh-bg-secondary border-r dark:border-slate-800/90">
      <div className="flex flex-col">
        {/* Logo Link */}
        <Link
        to="/"
        className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
        onClick={handleCloseSidebar}
        >
          <img src={ document.documentElement.classList == "dark" ? logoWhite : logo } alt="logo" className="w-full" />
        </Link>
        {/* Sidebar Column */}
        <div className="flex flex-col gap-5 text-base xl:text-lg">
          {/* Home Link */}
          <NavLink
          to="/"
          className={({ isActive }) => ( isActive ? isActiveStyle : isNotActiveStyle)}
          onClick={handleCloseSidebar}
          >
            <RiHomeFill/>
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base xl:text-lg 2xl:text-xl">Discover categories</h3>
          { categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) => ( isActive ? isActiveStyle : isNotActiveStyle ) }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              {/* <img src={category.image} alt="category" className="w-8 h-8 rounded-full shadow-sm" /> */}
              <BiCategoryAlt/> {category.name}
            </NavLink>
          )) }
        </div>
      </div>
      {/* {Dinamic Block of Code (DBC). Check if the user exists, if user exists, it will render this component} */}
      {user && (
        // If the user not exists, it render next Link
        <Link
        to={`user-profile/${user._id}`}
        className='w-fit flex my-5 mb-3 gap-2 px-2 py-1.5 mx-auto items-center text-sm font-medium text-center          bg-sd_btn_alternative border-sd_btn_alternative_hover text-white hover:bg-sd_btn_alternative_hover active:shadow-active dark:bg-gh_btn_alternative dark:hover:bg-gh_btn_alternative_hover shadow-primary border-default border-solid border-sd_btn_alternative_hover dark:border-transparent rounded-lg'
        >
          <img src={user.image} alt="user-profile" className="w-7 h- rounded-full rounded-full"/>
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
