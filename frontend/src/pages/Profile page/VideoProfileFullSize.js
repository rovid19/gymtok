import React, { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../../Usercontext";
import axios from "axios";

const VideoProfileFullSize = ({ name, closeFullVideo }) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [likedVideo, setLikedVideo] = useState(null);
  const [like, setLike] = useState(0);
  const [render, setRender] = useState(false);

  const [className, setClassName] = useState(
    "w-8 h-8 lg:h-10 lg:w-10 hover:text-gray-200 hover:scale-125 cursor-pointer"
  );

  const [volume, setVolume] = useState(0.5);
  function handleVolumeChange(e) {
    setVolume(e.target.value);
    videoRef.current.volume = volume;
  }
  const {
    video,
    spreman,
    user,
    userReady,
    setSpreman,
    setVideoTrigger,
    addRemoveLike,
    setAddRemoveLike,
  } = useContext(userContext);

  const videoRef = useRef(null);
  useEffect(() => {
    const index = video.findIndex((item) => item.video[0] === name[0]);
    console.log(index);
    if (index === 0) {
    } else {
      setIndex(index);
    }
  }, []);

  function playPause() {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }

  function handleLike() {
    if (className.includes("text-red-500")) {
      axios
        .put("/remove-like", {
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
        .put("/send-like", {
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

  useEffect(() => {
    if (window.innerWidth >= 1025) {
      function handleWheelEvent(e) {
        if (e.deltaY > 0) {
          setIndex((prev) => {
            if (prev === video.length - 1) {
              return prev;
            } else {
              return prev + 1;
            }
          });
        } else {
          setIndex((prev) => {
            if (prev === 0) {
              return prev;
            } else {
              return prev - 1;
            }
          });
        }
      }

      document.addEventListener("wheel", handleWheelEvent);
      return () => document.removeEventListener("wheel", handleWheelEvent);
    }
  }, [spreman]);

  useEffect(() => {
    if (window.innerWidth <= 1025) {
      if (video) {
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
            console.log("dolje");
            setIndex((prev) => {
              if (prev === video.length - 1) {
                return prev;
              } else {
                return prev + 1;
              }
            });
          } else if (startY > endY) {
            console.log("gore");
            setIndex((prev) => {
              if (prev === 0) {
                return prev;
              } else {
                return prev - 1;
              }
            });
          }
        }

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      }
    }
  }, [spreman]);

  useEffect(() => {
    if (like && likedVideo) {
      handleLike();
    }
  }, [like]);

  useEffect(() => {
    if (video && user) {
      const ifLiked = video[index].likes.includes(user._id);

      if (ifLiked) {
        setClassName(
          "w-8 h-8 lg:h-10 lg:w-10 hover:text-gray-200 hover:scale-125 cursor-pointer text-red-500"
        );
      } else {
        setClassName(
          "w-8 h-8 lg:h-10 lg:w-10 hover:text-gray-200 hover:scale-125 cursor-pointer"
        );
      }
    }
  }, [spreman, index]);
  console.log(index);
  function handleLikeSet() {
    setLike(user._id);
    setLikedVideo(video[index].video[0]);
  }

  return (
    <div className="absolute h-full w-full top-0 left-0 bg-black bg-opacity-90 flex justify-center">
      <div
        className="text-red-500 h-[10%] md:left-[10%] absolute mt-16 left-[5%] lg:left-[30%]  z-20 cursor-pointer   "
        onClick={closeFullVideo}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-8 h-8 lg:w-10 lg:h-10 hover:w-14 hover:scale-125 transition-all"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      {video && (
        <video
          volume={volume}
          ref={videoRef}
          loop
          onClick={playPause}
          className="h-[calc(100%-5%)] top-[5%] relative w-full z-10 cursor-pointer "
          src={"http://localhost:4000/uploads/videos/" + video[index].video[0]}
          autoPlay
        ></video>
      )}
      <div className=" bg-black z-30 group-hover:opacity-100 transition-all lg:bg-black text-white bg-opacity-80 border-t-2 border-gray-300 border-opacity-25 absolute bottom-0 h-12 lg:h-14 w-full flex lg:gap-2 justify-between lg:justify-center items-center p-2 lg:border-none">
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
          <div className="flex items-center text-sm lg:text-xl lg:hidden xl:flex  ">
            <h1>{index && video[index].title}</h1>
          </div>
          <div className="flex items-center lg:mr-8 gap-2 border-r-2 border-white border-opacity-25 border-l-2 pl-4 pr-4  ">
            {video && (
              <h1 className="block font-bold">{video[index].likes.length}</h1>
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
              <h1 className="lg:hidden font-bold">0</h1>
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
  );
};

export default VideoProfileFullSize;
