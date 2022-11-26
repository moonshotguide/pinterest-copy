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
        className="object-none flex xl:flex-row w-full h-full flex-col bg-sd_l_bg_default dark:bg-gh-bg-default"
        style={{
          backgroundSize: "contain",
          borderRadius: "32px",
          maxWidth: "1500px",
          backgroundImage: `url(${pinDetail.image?.asset?.url})`,
        }}
      >
        <div className="backdrop-blur-sm bg-white/3 p-6 w-full h-full maxandroid:p-2" style={{borderRadius: "32px"}}>
          <div
            className="flex xl:flex-row flex-col bg-sd_l_bg_default p-1 dark:bg-gh-bg-default"
            style={{
              // maxWidth: `(${document.querySelector("#pinImage").width})`,
              maxWidth: "1500px",
              borderRadius: "32px",
              backgroundSize: "cover",
            }}
          >
            <div className="flex justify-center items-center md:items-start flex-initial">
              <img
                src={pinDetail?.image && urlFor(pinDetail.image)}
                className="rounded-t-[30px] rounded-b-lg xl:rounded-[30px]"
                alt="user-post"
                id="pinImage"
              />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <a
                    href={`${pinDetail.image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 dark:bg-slate-900 w-fit h-9 rounded-full flex items-center justify-center text-sm px-3 opacity-70 hover:opacity-100 hover:shadow-md outline-none text-white dark:text-gh_button_text hover:bg-gh_l_button_hover dark:hover:bg-gh_button_hover"
                  >
                    <GoDesktopDownload fontSize={18} className="mr-2" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PinDetail;
