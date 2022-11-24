import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="px-2 md:px-4">
      <div className="bg-gh-l-bg-default dark:bg-gh-bg-default">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
      </div>
      {/* Pins Collection Background */}
      <div className="h-full bg-black dark:bg-gh-bg-primary rounded-lg p-2 mt-2">
        <Routes>
          <Route path="/" element={<Feed/>}/>
          <Route path="/category/:categoryId" element={<Feed/>}/>
          <Route path="/pin-detail/:pinId" element={<PinDetail user={user}/>}/>
          <Route path="/create-pin" element={<CreatePin user={user}/>}/>
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
