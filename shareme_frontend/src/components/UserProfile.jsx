import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { gapi } from "gapi-script";

import {
  GoogleLogin,
  GoogleLogout,
  GoogleOAuthProvider,
} from "react-google-login";


import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

import { client } from "../client";
import jwt_decode from "jwt-decode";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-red-500 text-white font-semibold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black dark:text-white font-semibold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); // Created | Saved
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);



  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <Spinner message="Loading Profile.. " />;

  return (
    <div className="relative pb-2 h-full justify-center items-center text-">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
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
                      style={{display: 'flex', gap: '0.25rem'}}
                      className="text-sm px-5 py-2.5 mr-2 mb-2 font-medium       bg-sd_btn_primary border-sd_btn_primary_hover text-light hover:bg-sd_btn_primary_hover active:shadow-active dark:text-white dark:bg-gh_btn_primary dark:hover:bg-gh_btn_primary_hover shadow-primary border-default border-solid border-sd_btn_primary_hover dark:border-transparent rounded-lg"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout fontSize={20} />
                      Logout
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
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
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        {pins?.length ? (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        ) : (
        <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
          No pins found!
        </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
