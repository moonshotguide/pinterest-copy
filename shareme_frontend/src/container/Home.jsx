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

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo =
    sessionStorage.getItem("user") !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : sessionStorage.clear();

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
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md bg-white dark:bg-slate-900 border-b dark:border-slate-400/10 border-slate-900/10">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          {/* Logo Shareme */}
          <Link to="/">
            <img src={ document.documentElement.classList == "dark" ? logoWhite : logo } alt="logo" className="w-1/2" />
          </Link>

          {/* Image Profile */}
            <Link to={`user-profile/${user?._id}`} className="flex flex-col items-center ">
              <img
                src={user?.image}
                alt="logo"
                className="w-14 rounded-full border-solid border-2 border-cyan-400"
              />
              <h1 className="pt-2 text-sm font-light text-slate-800 dark:text-slate-400 maxandroid:hidden">{user?.userName}</h1>
            </Link>
        </div>
        {/* Toggle Button SideBar Elements */}
        {toggleSidebar && (
            //blur filter and width full screen (Optional)
          <div className="fixed w-4/5 text-gray-800 dark:text-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in w-screen backdrop-blur backdrop-blur-sm">
            <div className="absolute w-full flex justify-end items-center p-2 overflow-y-auto android:max-w-[15rem] tablet:max-w-xs laptop:max-w-sm desktop:max-w-sm">
              <AiFillCloseCircle
                fontSize={28}
                className="cursor-pointer text-sky-600 dark:text-sky-400"
                onClick={() => setToggleSidebar(false)}
              />
            </div> 
            {/* Desktop Sidebar */}
            <Sidebar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll bg-white dark:bg-slate-900" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
// 1:40:32
