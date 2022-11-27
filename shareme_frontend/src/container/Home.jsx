import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { client } from "../client";
import logoWhite from "../assets/logowhite.png";
import logo from "../assets/logo.png";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex text-slate-900 dark:text-white sm:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden sm:flex h-screen flex-initial">
        {/* Mobile Sidebar */}
        <Sidebar user={user && user} />
      </div>
      {/* Head in small devices */}
      <div className="flex sm:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md bg-sd_l_bg_primary dark:bg-gh-bg-secondary border-b dark:border-slate-800/70 border-slate-900/10">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          {/* Logo Shareme */}
          <Link to="/">
            <img
              src={
                document.documentElement.classList == "dark" ? logoWhite : logo
              }
              alt="logo"
              className="w-1/2"
            />
          </Link>

          {/* Image Profile */}
          <Link
            to={`user-profile/${user?._id}`}
            className="flex flex-col items-center "
          >
            <img
              src={user?.image}
              alt="logo"
              className="w-14 rounded-full border-solid border-2 border-cyan-400"
            />
            <h1 className="pt-2 text-sm font-light text-slate-800 dark:text-slate-400 maxandroid:hidden">
              {user?.userName}
            </h1>
          </Link>
        </div>
        {/* Toggle Button SideBar Elements */}
        {toggleSidebar && (
          // blur filter and width full screen (w-screen) (Optional)
          <div  onClick={() => setToggleSidebar(false)} className="fixed w-screen text-gray-800 dark:text-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in backdrop-blur-sm">
            <div className="absolute w-full flex justify-end items-center p-2 overflow-y-auto android:max-w-[15rem] tablet:max-w-xs laptop:max-w-sm desktop:max-w-sm">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer rounded-full bg-white dark:bg-gh_button_text text-sd_l_bg_button dark:text-gh_bg_button hover:text-sd_l_button_hover dark:hover:text-gh_button_hover "
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            {/* Desktop Sidebar */}
            <Sidebar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      {/* Body */}
      <div
        className="pb-2 flex-1 h-screen overflow-y-scroll bg-gh-l-bg-default dark:bg-gh-bg-default"
        ref={scrollRef}
      >
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

// Modern React Web Development Full Course - 12 Hours | 4 Real Industry Web Applications
// https://www.bing.com/videos/search?q=react+modern+12+hours&docid=607997018356260593&mid=051F33899DC6862EFB52051F33899DC6862EFB52&view=detail&FORM=VIRE
// Texte Gradient
// https://redpixelthemes.com/blog/tailwindcss-gradient-text/
// https://tailwindcolor.com/