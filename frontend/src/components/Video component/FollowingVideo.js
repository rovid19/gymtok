import React, { useEffect, useRef } from "react";
import { userContext } from "../../Usercontext";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments.js";

const Video = ({ followingVideos }) => {
  // CONTEXT & EXTRA
  const { spreman, user, userReady, addRemoveLike, setAddRemoveLike } =
    useContext(userContext);

  const navigate = useNavigate();
  const videoRef = useRef(null);

  // STATES
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideo, setLikedVideo] = useState(null);
  const [like, setLike] = useState(0);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [className, setClassName] = useState(
    "w-8 h-8 lg:h-10 lg:w-10 hover:text-red-500 hover:scale-125 cursor-pointer"
  );

  // HANDLE VOLUME CHANGE
  function handleVolumeChange(e) {
    setVolume(e.target.value);
    videoRef.current.volume = volume;
  }

  // HANDLE PLAY PAUSE
  function playPause() {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }

  // AXIOS SEND OR REMOVE LIKE FROM A VIDEO
  function handleLike() {
    if (
      followingVideos &&
      followingVideos[currentVideoIndex].likes.includes(user._id)
    ) {
      axios
        .put("/api/interaction/remove-like", {
          like,
          likedVideo,
        })
        .then(() => {
          setAddRemoveLike(!addRemoveLike);
          setLike(null);
          setLikedVideo(null);
        });
    } else {
      axios
        .put("/api/interaction/send-like", {
          like,
          likedVideo,
        })
        .then(() => {
          setAddRemoveLike(!addRemoveLike);
          setLike(null);
          setLikedVideo(null);
        });
    }
  }

  // ON SCROLL FUNCTION THAT FOR SCROLLING ON VIDEOS - DESKTOP
  useEffect(() => {
    if (followingVideos) {
      function handleWheelEvent(e, followingVideos) {
        if (e.deltaY > 0) {
          setCurrentVideoIndex((prev) => {
            if (prev === followingVideos.length - 1) {
              return prev;
            } else {
              return prev + 1;
            }
          });
        } else {
          setCurrentVideoIndex((prev) => {
            if (prev === 0) {
              return prev;
            } else {
              return prev - 1;
            }
          });
        }
      }

      const div = document.querySelector("#Mirko");

      div.addEventListener("wheel", (e) =>
        handleWheelEvent(e, followingVideos)
      );
      return () =>
        div.removeEventListener("wheel", (e) =>
          handleWheelEvent(e, followingVideos)
        );
    }
  }, [followingVideos]);

  // ON SCROLL FUNCTION THAT FOR SCROLLING ON VIDEOS - MOBILE
  useEffect(() => {
    if (followingVideos) {
      let startY = 0;
      let endY = 0;

      function handleTouchStart(e) {
        startY = e.touches[0].clientY;
      }

      function handleTouchMove(e) {
        endY = e.touches[0].clientY;
      }

      function handleTouchEnd() {
        if (startY < endY) {
          setCurrentVideoIndex((prev) => {
            if (prev === followingVideos.length - 1) {
              return prev;
            } else {
              return prev + 1;
            }
          });
        } else if (startY > endY) {
          setCurrentVideoIndex((prev) => {
            if (prev === 0) {
              return prev;
            } else {
              return prev - 1;
            }
          });
        }
      }

      const div = document.querySelector("#Mirko");

      div.addEventListener("touchstart", (e) => handleTouchStart(e));
      div.addEventListener("touchmove", (e) => handleTouchMove(e));
      div.addEventListener("touchend", handleTouchEnd);
    }
  }, [followingVideos]);

  // STATE CHECK BEFORE SENDING OR REMOVE LIKES
  useEffect(() => {
    if (like && likedVideo) {
      handleLike();
    }
  }, [like]);

  // CHECK IF USER ALREADY LIKED A VIDEO
  useEffect(() => {
    if (followingVideos && user) {
      const ifLiked = followingVideos[currentVideoIndex].likes.includes(
        user._id
      );
      console.log(ifLiked);

      if (ifLiked) {
        setClassName(
          "w-8 h-8 lg:h-10 lg:w-10 hover:text-red-500 hover:scale-125 cursor-pointer text-red-500"
        );
      } else {
        setClassName(
          "w-8 h-8 lg:h-10 lg:w-10 hover:text-red-500 hover:scale-125 cursor-pointer"
        );
      }
    }
  }, [spreman, currentVideoIndex, userReady, followingVideos]);

  // SET STATE FOR COMMENTS
  useEffect(() => {
    if (followingVideos) {
      setName(followingVideos[currentVideoIndex].video[0]);
    }
  }, [followingVideos, currentVideoIndex]);

  // SET STATE FOR REMOVE OR SEND LIKE
  function handleLikeSet() {
    if (!user) {
      alert("You must be logged in in order to like a video");
    } else {
      setLike(user._id);
      setLikedVideo(followingVideos[currentVideoIndex].video[0]);
    }
  }

  // HANDLE OPEN/CLOSE COMMENTS
  function handleOpenCloseComments() {
    setVisible(!visible);
  }

  // SET COLOR OF LIKE BUTTON IF USER DOESNT EXIST TO DEFAULT
  useEffect(() => {
    if (!user) {
      setClassName(
        "w-8 h-8 lg:h-10 lg:w-10 hover:text-gray-200 hover:scale-125 cursor-pointer"
      );
    }
  }, [userReady]);

  // NAVIGATE TO CLICKED USER PROFILE
  useEffect(() => {
    if (profileId) {
      handleNavigate();
      setProfileId(null);
    }
  }, [profileId]);

  function handleNavigate() {
    if (profileId) {
      console.log(profileId);
      navigate(`/profile/${profileId}`);
    }
  }
  //
  console.log(name);
  return (
    <div className="relative h-full w-full group  flex justify-center ">
      {visible && (
        <Comments
          handleOpenCloseComments={handleOpenCloseComments}
          name={name}
          visible={visible}
        />
      )}
      <div
        id="Mirko"
        className="h-full w-full cursor-pointer  overflow-auto flex bg-black lg:bg-white"
      >
        {followingVideos && (
          <video
            volume={volume}
            ref={videoRef}
            loop
            onClick={playPause}
            className="h-full w-full "
            src={
              followingVideos &&
              "https://gymtok-api-app.onrender.com/uploads/" +
                followingVideos[currentVideoIndex].video
            }
            autoPlay
          ></video>
        )}
      </div>
      <div className="   lg:hidden  z-20 lg:z-0 lg:group-hover:flex group-hover:opacity-100 transition-all  text-white bg-opacity-80 border-t-2 border-gray-300 border-opacity-25 absolute bottom-0 h-12 lg:h-14 w-full lg:rounded-xl rounded-none bg-black bg-opacity-40 flex lg:gap-2 justify-between lg:justify-center items-center p-2 lg:border-none">
        <div className="flex justify-between w-full">
          <div className="hidden lg:flex items-center ml-8 border-r-2 border-white border-opacity-25 border-l-2 pl-4 pr-4 ">
            <label className="hidden lg:block h-full cursor-pointer">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="cursor-pointer h-full"
              />
            </label>
          </div>
          <div
            className=" border-r-2 border-white border-opacity-25  pr-4 lg:pr-0 lg:pl-0 lg:border-none flex items-center  text-sm lg:text-xl xl:flex cursor-pointer hover:bg-red-500 hover:rounded-xl  transition-all  "
            onClick={(e) => {
              setProfileId(followingVideos[currentVideoIndex].owner);
              handleNavigate();
            }}
          >
            <h1>
              @{followingVideos && followingVideos[currentVideoIndex].username}
            </h1>
          </div>
          <div className="flex items-center lg:mr-8 gap-2 border-r-2 border-white border-opacity-25 border-l-2 pl-4 pr-4  ">
            {followingVideos && (
              <h1 className="block font-bold">
                {followingVideos[currentVideoIndex].likes.length}
              </h1>
            )}
            <div onClick={() => handleLikeSet()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={className}
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => handleOpenCloseComments()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-8 h-8 lg:h-10 lg:w-10 hover:text-red-500 hover:scale-125 cursor-pointer"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
