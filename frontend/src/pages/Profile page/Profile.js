import React from "react";
import { userContext } from "../../Usercontext";
import { useContext, useState } from "react";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(userContext);

  function handleVisible() {
    setVisible(!visible);
  }
  return (
    <div className="bg-red-500 lg:bg-black lg:bg-opacity-60 h-full fl lg:w-full w-[calc(100%-80px)] relative left-[80px] lg:left-0">
      <div className="lg:w-[55%] w-full bg-white h-full grid-cols-1 fl">
        {visible && <EditProfile handleVisible={handleVisible} />}
        {visible ? (
          ""
        ) : (
          <>
            {" "}
            <div className="h-[30%] w-full lg:w-[70%]  xl:w-[50%] flex-col mt-6 ">
              <div className="flex h-[70%]">
                <div className="w-[200px]  h-[100%]  flex justify-center">
                  <img
                    src="https://www.freeiconspng.com/thumbs/profile-icon-png/am-a-19-year-old-multimedia-artist-student-from-manila--21.png"
                    className="h-full rounded-full"
                  ></img>
                </div>
                <div className="w-[200px] h-[100%] ">
                  <div className="text-3xl uppercase mt-4 ">
                    <h1>{user.username}</h1>
                    <h2 className="text-xl ">{user.email}</h2>
                  </div>
                  <button
                    onClick={handleVisible}
                    className="mt-8 bg-black p-2 w-36 rounded-2xl text-white hover:bg-gray-500 "
                  >
                    Edit profile
                  </button>
                </div>
              </div>
              <div className="">
                <div className="flex gap-4 mt-2 ml-6 ">
                  <h1>
                    <span className="font-bold">0</span> Follower
                  </h1>{" "}
                  <h1>
                    <span className="font-bold">0</span> Following
                  </h1>{" "}
                  <h1>
                    <span className="font-bold">0</span> Likes
                  </h1>
                </div>
                <div className="mt-1 ml-6">
                  <p>No bio yet</p>
                </div>
              </div>
            </div>
            <div className="h-[70%]  w-full lg:w-[90%]">d</div>{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
