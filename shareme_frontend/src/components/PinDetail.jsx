import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineHeart } from "react-icons/ai";
import { GoCommentDiscussion } from "react-icons/go";
// import { GoDesktopDownload } from "react-icons/go";
import { GoTrashcan } from "react-icons/go";
import { HiCloudDownload } from "react-icons/hi";
import { GiOverkill } from "react-icons/gi";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [popup, setPopup] = useState(false);

  const navigate = useNavigate();

  // Aplica una condicion de estilos para tamaños de pantalla Android
  // const [matches, setMatches] = useState(
  //   window.matchMedia("(min-width: 419px)").matches
  // );

  // useEffect(() => {
  //   window
  //   .matchMedia("(min-width: 419px)")
  //   .addEventListener('change', e => setMatches( e.matches ));
  // }, []);

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        // console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
      navigate(-1);
      // setSavingPost(false);
    });
  };

  if (!pinDetail) return <Spinner message="Loading Pin" />;

  return (
    <>
      {pinDetail && (
        <div
          className="object-none flex xl:flex-row w-full h-full flex-col bg-sd_l_bg_default dark:bg-gh-bg-default max-w-widthImg"
          style={{
            backgroundSize: "contain",
            borderRadius: "32px",
            // maxWidth: "1500px",
            backgroundImage: `url(${pinDetail.image?.asset?.url})`,
          }}
        >
          <div className="backdrop-blur-sm bg-white/3 p-6 w-full h-full android:p-2 rounded-[32px]">
            <div
              className="flex xl:flex-row flex-col bg-sd_l_bg_default p-1 dark:bg-gh-bg-default rounded-[32px]"
              style={{
                // maxWidth: "1500px",
                backgroundSize: "cover",
              }}
            >
              {pins?.length > 0 && (
                <div className="flex justify-center items-center md:items-start flex-initial">
                  <img
                    src={pinDetail?.image && urlFor(pinDetail?.image).url()}
                    className="rounded-t-[30px] rounded-b-lg xl:rounded-[30px] "
                    style={
                      !user
                        ? {
                            maxHeight:
                              "calc(100vh - (4px + 4px + 8px + 8px + (4px + 8px) + (32px + 32px + 16px)))",
                          }
                        : {
                            maxHeight:
                              "calc(100vh - ((48px + 20px + 12px) + 4px + 4px + 8px + 8px + (32px + 32px + 16px)))",
                          }
                    }
                    alt="user-post"
                    id="pinImage"
                  />
                </div>
              )}
              {!pins?.length > 0 && (
                <div className="flex justify-center items-center md:items-start flex-initial">
                  <img
                    src={pinDetail?.image && urlFor(pinDetail?.image).url()}
                    className="rounded-t-[30px] rounded-b-lg xl:rounded-[30px]"
                    style={
                      !user
                        ? {
                            maxHeight:
                              "calc(100vh - (4px + 4px + 8px + 8px + (4px + 8px)))",
                          }
                        : {
                            maxHeight:
                              "calc(100vh - ((48px + 20px + 12px) + 4px + 4px + 8px + 8px + (4px + 8px)))",
                          }
                    }
                    alt="user-post"
                    id="pinImage"
                  />
                </div>
              )}

              {/* Right Side Box of Pin */}
              <div className="w-full p-5 flex-1">
                <div className="flex items-center justify-between flex-col lg:flex-row">
                  <div className="flex gap-2 items-center">
                    <a
                      href={`${pinDetail.image.asset.url}?dl=`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="w-fit h-9 flex items-center justify-center text-sm px-4 py-2 outline-none   bg-sd_btn_primary border-sd_btn_primary_hover text-light hover:bg-sd_btn_primary_hover active:shadow-active dark:text-white dark:bg-gh_btn_primary dark:hover:bg-gh_btn_primary_hover shadow-primary border-default border-solid border-sd_btn_primary_hover dark:border-transparent rounded-lg"
                    >
                      Download
                      <HiCloudDownload fontSize={20} className="ml-2" />
                    </a>
                  </div>
                  <a
                    href={pinDetail.destination}
                    target="_blank"
                    rel="noreferrer"
                    className="maxandroid:text-xs tablet:text-sm dark:font-extralight maxlaptop:mt-2 font-normal"
                  >
                    {pinDetail.destination}
                  </a>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold break-words mt-3">
                    {pinDetail.title}
                  </h1>
                  <p className="mt-3 text-sm">{pinDetail.about}</p>
                </div>
                {/* Link to user profile */}
                {/* If the user is login return user profile link */}
                <Link
                  to={`/user-profile/${pinDetail?.postedBy._id}`}
                  className="flex gap-2 mt-5 items-center bg-sd_l_bg_default dark:bg-gh-bg-default rounded-lg p-1"
                >
                  <img
                    className="w-8 h-8 rounded-full object-cover border border-solid border-cyan-400"
                    src={pinDetail?.postedBy.image}
                    alt="user-profile"
                  />
                  <p className="text-sm font-semibold capitalize text-white">
                    {pinDetail?.postedBy.userName}
                  </p>
                </Link>
                <h2 className="mt-5 text-xl">Comments</h2>
                <div className="max-h-450 overflow-y-auto">
                  {/* Is there comments? */}
                  {pinDetail?.comments?.map((item) => (
                    <div
                      className="flex flex-col w-full h-fit mb-3"
                      key={item.comment}
                    >
                      <div className="flex gap-2 mt-2 items-center bg-sd_l_bg_default dark:bg-gh-bg-primary rounded-lg justify-between p-1">
                        <div className="flex flex-row gap-2 items-center">
                          <img
                            src={item.postedBy?.image}
                            alt="user-profile"
                            className="w-9 h-9 rounded-full curso r-pointer"
                          />
                          <div className="flex flex-col">
                            <p className="font-bold">
                              {item.postedBy?.userName}
                            </p>
                            <p className="font-thin">{item.comment}</p>
                          </div>
                        </div>
                      </div>
                      {/* Like and share icon */}
                      <div className="flex flex-row gap-10 mt-1 ml-1 justify-end text-sm">
                        <button className="flex flex-row items-center">
                          <AiOutlineHeart fontSize={16} className="mr-1" />
                          Like
                        </button>
                        <button className="flex flex-row items-center">
                          <GoCommentDiscussion fontSize={16} className="mr-1" />
                          Reply
                        </button>
                        {/* If user has create the comment, he/she can delete it */}
                        {/* Erase comment button */}
                        {pinDetail.postedBy?._id === user?._id && (
                          <>
                            <button className="flex flex-row items-center">
                              <GoTrashcan fontSize={16} className="mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Where user add the comment */}
                {/* If the user is login return input field */}
                {user && (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap mt-10 gap-3 w-full items-center">
                      {/* Link to user profile */}
                      <Link to={`/user-profile/${user._id}`}>
                        <img
                          src={user.image}
                          className="w-10 h-10 rounded-full cursor-pointer border border-solid border-cyan-400"
                          alt="user-profile"
                        />
                      </Link>
                      <input
                        type="text"
                        className="flex-1 outline-none rounded-2xl border p-2 focus:border-gray-300 dark:border-slate-400/30 border-slate-900/10"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      {/* Post comment Button */}
                      <button
                        type="button"
                        className="px-6 py-2 outline-none text-white font-semibold text-base    bg-sd_btn_alternative border-sd_btn_alternative_hover text-white hover:bg-sd_btn_alternative_hover active:shadow-active dark:bg-gh_btn_alternative dark:hover:bg-gh_btn_alternative_hover shadow-primary border-default border-solid border-sd_btn_primary_hover dark:border-transparent rounded-lg"
                        onClick={addComment}
                      >
                        {addingComment ? "Posting the comment" : "!Post"}
                      </button>
                    </div>
                    {/* Delete Pin button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopup(true);
                      }}
                      className="w-fit h-10 mt-5 flex items-center justify-center text-sm px-4 py-2 outline-none   text-white bg-sd_btn_alternative border-sd_btn_alternative_hover text-base hover:bg-sd_btn_alternative_hover active:shadow-active shadow-primary border-default border-solid border-transparent rounded-lg"
                    >
                      Delete Pin
                      <HiCloudDownload fontSize={20} className="ml-2" />
                    </button>
                    {/* Popup Banner warning delete pin */}
                    {pinId?._id === user?.sub && (
                      <>
                        {popup && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setPopup(false);
                            }}
                            id="popup-modal"
                            tabIndex="-1"
                            className="fixed z-50 p-4 overflow-x-hidden overflow-y-auto inset-0 h-modal h-full backdrop-blur-sm bg-white/3"
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
                                  <GiOverkill
                                    fontSize={70}
                                    className="m-auto my-6"
                                  />
                                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this pin?
                                  </h3>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deletePin(pinId);
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          {pins ? (
            <MasonryLayout pins={pins} />
          ) : (
            <Spinner message="Loading more pins" />
          )}
        </>
      )}
    </>
  );
};

export default PinDetail;
