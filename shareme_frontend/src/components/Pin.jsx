import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { GiSave } from "react-icons/gi";
import { GoDesktopDownload, GoPin } from "react-icons/go";
import { BsFillTrash2Fill } from "react-icons/bs";
import { GiOverkill } from "react-icons/gi";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [PostHovered, setPostHovered] = useState(false);
  const [popup, setPopup] = useState(false);
  // const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  let alreadySaved = !!save?.filter((item) => item?.postedBy?._id === user?.sub);

  //Explanation
  // 1, [2, 3, 1] (filter)-> [1].length -> 1 -> !1 -> false -> !false -> true
  // 1, [2, 3, 4] (filter)-> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if (alreadySaved === false) {
      // setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub, //ref
            },
            userId: user?.sub,
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          // setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
      // setSavingPost(false);
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)} // change to true to see the div in devtools
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 easy-in-out"
      >

        {PostHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 dark:bg-slate-900 w-fit h-9 rounded-full flex items-center justify-center text-sm px-3 opacity-70 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-gh_l_button_hover dark:hover:bg-gh_button_hover"
                >
                  <GoDesktopDownload fontSize={18} className="mr-2" />
                  Download
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-teal-700 dark:bg-teal-700 w-fit h-9 rounded-full flex items-center justify-center text-sm px-3 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-teal-900 dark:hover:bg-teal-900"
                >
                  <GoPin fontSize={18} className="mr-2" /> Saved {save?.lenght}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-700 dark:bg-red-700 w-fit h-9 rounded-full flex items-center justify-center text-sm px-3 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-red-900 dark:hover:bg-red-900"
                >
                  <GiSave fontSize={18} className="mr-2" /> Save
                  {/* {savingPost? 'saving' : 'Save'} */}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black text-sm font-bold p-2 pl-4 pr-4 rounded-full opacity-80 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
              {/* If user has create the PIN, he can delete it */}
              {postedBy?._id === user?.sub && (
                <button
                  onClick={(e) => {
                    // handleBackClick();
                    e.stopPropagation();
                    setPopup(true);
                  }}
                  type="button"
                  className="bg-slate-900 w-fit h-9 rounded-full flex items-center justify-center font-bold px-3 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-black dark:hover:bg-black"
                >
                  <BsFillTrash2Fill fontSize={24} />
                </button>
              )}
              {/* Popup Banner warning delete pin */}
              {postedBy?._id === user?.sub && (
                <>
                  {popup && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopup(false);
                      }}
                      id="popup-modal"
                      tabIndex="-1"
                      className="fixed z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 h-modal h-full backdrop-blur-sm"
                    >
                      <div className="top-[calc(25vh)] relative w-full h-full max-w-md md:h-auto m-auto">
                        <div className="relative bg-sd_l_bg_primary rounded-lg shadow dark:bg-gh-bg-primary">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPopup(false);
                            }}
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                          >
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <div className="p-6 text-center">
                            {/* <svg
                              aria-hidden="true"
                              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg> */}
                            
                            <GiOverkill fontSize={70} className='m-auto my-6'/>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                              Are you sure you want to delete this pin?
                            </h3>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePin(_id);
                              }}
                              className="font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2      bg-sd_btn_alternative border-sd_btn_alternative_hover text-white hover:bg-sd_btn_alternative_hover active:shadow-active dark:bg-gh_btn_alternative dark:hover:bg-gh_btn_alternative_hover shadow-primary border-default border-solid border-sd_btn_alternative_hover dark:border-transparent rounded-lg"
                            >
                              Yes, I'm sure
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPopup(false);
                              }}
                              type="button"
                              className="rounded-lg text-sm font-medium px-5 py-2.5        bg-sd_btn_primary border-sd_btn_primary_hover text-light hover:bg-sd_btn_primary_hover active:shadow-active dark:text-white dark:bg-gh_btn_primary dark:hover:bg-gh_btn_primary_hover shadow-primary border-default border-solid border-sd_btn_primary_hover dark:border-transparent rounded-lg"
                            >
                              No, cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <img
          className="rounded-lg w-fill_available cursor-zoom-in"
          src={urlFor(image).width().url()}
          alt="user-post"
          onClick={() => navigate(`/pin-detail/${_id}`)}
        />
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover border border-solid border-cyan-400"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="text-sm font-semibold capitalize text-white">
          {postedBy?.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
