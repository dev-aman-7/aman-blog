import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Signup from "./pages/SIgnup";
import VerifyAccount from "./pages/VerifyAccount";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import MyAccount from "./pages/MyAccount";
import PostDetails from "./pages/PostDetails";
import PostEditor from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/post/:postId" element={<PostDetails />} />

        <Route
          path="/my-account"
          element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <PrivateRoute>
              <PostEditor />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-post/:postId"
          element={
            <PrivateRoute>
              <PostEditor />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <PrivateRoute>
              <MyPosts />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
