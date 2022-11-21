import React, { useState, useRef, useEffect } from "react";
import { navLink, Link, NavLink } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import logoWhite from "../assets/logowhite.png";
import logo from "../assets/logo.png";

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-slate-600 dark:text-slate-400 hover:text-black hover:font-semibold dark:hover:text-white border-slate-400 transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 text-red-600 dark:text-sky-400 font-extrabold border-r-2 border-black dark:border-slate-400 transition-all duration-200 ease-in-out capitalize';

//Indeed it's came from sanity json backend, this list is just for testing
const categories = [
  { name: 'Animals' },
  { name: 'Wallpapers' },
  { name: 'Photography' },
  { name: 'Gaming' },
  { name: 'Coding' },
  { name: 'Other' }
]

const Sidebar = ({ user, closeToggle }) => {
  //close sidebar when something
  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
  }

  return (
    <div className="flex flex-col justify-between h-full overflow-y-scroll min-w-210 android:max-w-[15rem] tablet:max-w-xs laptop:max-w-sm desktop:max-w-sm hide-scrollbar bg-sd_l_bg_primary dark:bg-gh-bg-secondary border-r dark:border-slate-800/70">
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
        <div className="flex flex-col gap-5 text-base xl:text-lg 2xl:text-xl">
          {/* Home Link */}
          <NavLink
          to="/"
          className={({ isActive }) => ( isActive ? isActiveStyle : isNotActiveStyle ) }
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
        className='flex my-5 mb-3 gap-2 p-1 mx-1 items-center rounded-xl shadow-lg text-white bg-sd_l_bg_secondary hover:bg-sd_l_button_hover dark:hover:bg-gh_button_hover dark:bg-gh_bg_button '
        >
          <img src={user.image} alt="user-profile" className="w-10 h-10 rounded-full rounded-full border-solid border-2 border-cyan-400"/>
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};



// Modern React Web Development Full Course - 12 Hours | 4 Real Industry Web Applications
// 1:40:32
// https://www.bing.com/videos/search?q=react+modern+12+hours&docid=607997018356260593&mid=051F33899DC6862EFB52051F33899DC6862EFB52&view=detail&FORM=VIRE
// Texte Gradient
// https://redpixelthemes.com/blog/tailwindcss-gradient-text/
// https://tailwindcolor.com/

export default Sidebar;
