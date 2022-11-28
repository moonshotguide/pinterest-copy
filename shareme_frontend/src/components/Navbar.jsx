import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 mb-3">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-sd_l_bg_primary dark:bg-gh-bg-primary border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={25} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 w-full bg-sd_l_bg_primary dark:bg-gh-bg-primary outline-none'
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
          <img src={user.image} alt="user" className="w-14 h-12 rounded-lg" />
        </Link>
        <Link to='create-pin' className='rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center bg-sd_l_bg_button dark:bg-gh_bg_button text-white dark:text-gh_text_primary hover:bg-sd_l_button_hover dark:hover:bg-gh_button_hover'>
          <IoMdAdd fontSize={23} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
