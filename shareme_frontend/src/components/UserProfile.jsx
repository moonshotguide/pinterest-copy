import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import {
  GoogleLogin,
  GoogleLogout,
  GoogleOAuthProvider,
} from "react-google-login";
import { gapi } from "gapi-script";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import jwt_decode from "jwt-decode";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = "https://dummyimage.com/1600x900/000/fff";

const activeBtnStyles =
  "bg-red-500 text-white font-semibold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black text-white font-semibold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); // Created | Saved
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  // const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <Spinner message="Loading Profile.. " />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-Picture"
            />
            <img
              src={user?.image}
              className="rounded-full w-20 h-20 mt-10 shadow-xl object-cover"
              alt="user-picture"
            />
            <h1 className="font-semibold text-2xl text-center m-3">
              {user?.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-red-500 p-2 rounded-full cursor-pointer outline-none shadow-md flex text-white gap-[0.5rem] px-[0.5rem] py-[0.25rem] text-xl items-center"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="white" fontSize={25} />
                      Logout
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
              {/* <GoogleLogout clientId={process.env.REACT_APP_GOOGLE_API_TOKEN} buttonText="Log out" onLogoutSuccess={logout} /> */}
            </div>
          </div>
        </div>

        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>
      </div>
      UserProfile
    </div>
  );
};

export default UserProfile;
