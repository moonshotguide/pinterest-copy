import React, { useState, useEffect } from "react";
import { GoDesktopDownload } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  // ID..
  const { pinId } = useParams();
  // Comment
  const addComment = () => {
    if (comment) {
      setAddingComment(true)
      client
        .patch(pinId)
        .setIfMissing({ comments: [] }) // If we don't have any comment already
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(pinId);

          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading Pin" />;

  return (
    <>
      <div
        className="object-none flex xl:flex-row w-full h-full flex-col bg-sd_l_bg_default dark:bg-gh-bg-default max-w-widthImg"
        style={{
          backgroundSize: "contain",
          borderRadius: "32px",
          // maxWidth: "1500px",
          backgroundImage: `url(${pinDetail.image?.asset?.url})`,
        }}
      >
        <div
          className="backdrop-blur-sm bg-white/3 p-6 w-full h-full android:p-2"
          style={{ borderRadius: "32px" }}
        >
          <div
            className="flex xl:flex-row flex-col bg-sd_l_bg_default p-1 dark:bg-gh-bg-default"
            style={{
              // maxWidth: "1500px",
              borderRadius: "32px",
              backgroundSize: "cover",
            }}
          >
            <div className="flex justify-center items-center md:items-start flex-initial">
              <img
                src={pinDetail?.image && urlFor(pinDetail.image)}
                className="rounded-t-[30px] rounded-b-lg xl:rounded-[30px] max-h-heightImg"
                alt="user-post"
                id="pinImage"
              />
            </div>
            {/* Right Side Box of Pin */}
            <div className="w-full p-5 flex-1">
              <div className="flex items-center justify-between flex-col lg:flex-row">
                <div className="flex gap-2 items-center">
                  <a
                    href={`${pinDetail.image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-sd_l_bg_button dark:bg-gh_bg_button w-fit h-9 rounded-full flex items-center justify-center text-sm px-3 opacity-70 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-gh_l_button_hover dark:hover:bg-gh_button_hover"
                  >
                    <GoDesktopDownload fontSize={18} className="mr-2" />
                    Download
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
              <Link
                to={`user-profile/${pinDetail.postedBy?._id}`}
                className="flex gap-2 mt-5 items-center bg-sd_l_bg_default dark:bg-gh-bg-default rounded-lg p-1"
              >
                <img
                  className="w-8 h-8 rounded-full object-cover border border-solid border-cyan-400"
                  src={pinDetail.postedBy?.image}
                  alt="user-profile"
                />
                <p className="text-sm font-semibold capitalize text-white">
                  {pinDetail.postedBy?.userName}
                </p>
              </Link>
              <h2 className="mt-5 text-xl">Comments</h2>
              <div className="max-h-370 overflow-y-auto">
                {/* Is there comments? */}
                {pinDetail?.comment?.map((comment, i) => (
                  <div
                    className="flex gap-2 mt-2 items-center bg-sd_l_bg_default dark:bg-gh-bg-default rounded-lg"
                    key={i}
                  >
                    <img
                      src={comment.postedBy.image}
                      alt="user-profile"
                      className="w-10 h-10 rounded-full cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">{comment.postedBy.userName}</p>
                      <p className="font-thin">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Where user add the comment */}
              <div className="flex flex-wrap mt-6 gap-3">
                {/* Link to user profile */}
                <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                  <img
                    className="w-7 h-7 rounded-full cursor-pointer border border-solid border-cyan-400"
                    src={pinDetail.postedBy?.image}
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
                <button
                  type="button"
                  className="bg-sd_l_bg_button hover:bg-sd_l_button_hover dark:bg-gh_bg_button dark:hover-bg-gh_l_button_hover text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                  onClick={addComment}
                >
                  {addingComment ? 'Posting the comment' : "!Post"}

                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PinDetail;
