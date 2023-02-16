import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Navbar from "./components/Navbar component/Navbar";
import { useState } from "react";
import Login from "./pages/Login";
import axios from "axios";
import { userContext } from "./Usercontext";
import { useEffect } from "react";
import { useContext } from "react";
import Profile from "./pages/Profile page/Profile";
import Upload from "./pages/Upload";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
const App = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState("");
  const [video, setVideo] = useState(null);
  const [videoTrigger, setVideoTrigger] = useState("");

  function handleOpenClose() {
    setOpenLogin(!openLogin);
  }
  function handleOpenCloseUpload() {
    setOpenUpload(!openUpload);
  }

  useEffect(() => {
    if (!user) {
      axios.get("/profile", {}).then(({ data }) => {
        setUser(data);
        setReady("ha");
      });
    }
  }, [ready]);

  useEffect(() => {
    axios.get("/video-store", {}).then(({ data }) => {
      setVideo(data);
      setVideoTrigger("neke");
    });
  }, [videoTrigger]);
  console.log(user);
  return (
    <div>
      <userContext.Provider
        value={{
          user,
          setUser,
          ready,
          setReady,
          video,
          setVideo,
          setVideoTrigger,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                handleOpenClose={handleOpenClose}
                handleUpload={handleOpenCloseUpload}
              />
            }
          >
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        {openLogin && <Login handleOpenClose={handleOpenClose} />}
        {openUpload && <Upload handleOpenClose={handleOpenCloseUpload} />}
      </userContext.Provider>
    </div>
  );
};

export default App;
