import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { AiTwotoneDelete } from "react-icons/ai";
import { GiSave } from "react-icons/gi";
import { GoDesktopDownload, GoPin } from "react-icons/go";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [PostHovered, setPostHovered] = useState(false);
  // const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  // let alreadySaved = !!(save?.filter((item) => item.postedBy.id === user?.sub));
  let alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub));
  console.log(client.postedBy?._id);
  console.log(user?.sub);
  console.log(alreadySaved);

  //Explanation
  // 1, [2, 3, 1] (filter)-> [1].length -> 1 -> !1 -> false -> !false -> true
  // 1, [2, 3, 4] (filter)-> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if (alreadySaved === false ) {
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
    client
      .delete(id)
      .then(() => {
        window.location.reload();
        // setSavingPost(false);
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 easy-in-out"
      >
        <img
          className="rounded-lg w-fill_available"
          src={urlFor(image).width().url()}
          alt="user-post"
        />
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
                  className="bg-slate-900 dark:bg-slate-900 w-fit h-8 rounded-full flex items-center justify-center text-md px-3 opacity-70 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-gh_l_button_hover dark:hover:bg-gh_button_hover"
                >
                  <GoDesktopDownload fontSize={18} className="mr-2" />
                  Download
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-slate-700 dark:bg-slate-700 w-fit h-12 rounded-full flex items-center justify-center text-md px-5 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-slate-900 dark:hover:bg-slate-900"
                >
                  <GoPin className="mr-2" /> Saved {save?.lenght}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-700 dark:bg-red-700 w-fit h-12 rounded-full flex items-center justify-center text-md px-5 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-red-900 dark:hover:bg-red-900"
                >
                  <GiSave className="mr-2" /> Save
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
                  className="bg-white flex items-center gap-2 text-black text-xs font-bold p-2 pl-4 pr-4 rounded-full opacity-80 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20 ? destination.slice(12, 24) : destination.slice(8)}
                </a>
              )}
              {/* If user has create the PIN, he can delete it */}
              {postedBy?._id === user?.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  type="button"
                  className="bg-red-700 dark:bg-red-700 w-fit h-12 rounded-full flex items-center justify-center text-md px-5 opacity-80 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-red-900 dark:hover:bg-red-900"
                >
                  <GiSave className="mr-2" /> Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
