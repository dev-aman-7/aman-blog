import React from "react";
import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  return (
    <div>
      <div className="p-6 px-28 mt-20 w-full flex items-start gap-10">
        <PostsList />
        <Sidebar />
      </div>
    </div>
  );
};

export default Homepage;
