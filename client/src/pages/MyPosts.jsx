import axios from "axios";
import React, { useEffect, useState } from "react";
import { ApiUrl } from "../url";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MyPosts = () => {
  const { accessToken } = useAuth();
  const [myBlogList, setMyBlogList] = useState([]);
  const fetchMyPosts = async () => {
    try {
      const response = await axios.get(`${ApiUrl.blogBaseUrl}/user-blog`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        setMyBlogList(response.data.data.blogLists);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);
  return (
    <div>
      <div className="mt-20 flex gap-5 px-28">
        <div className="w-9/12">
          {myBlogList?.map((item) => (
            <PostCard data={item} key={item._id} editable={true} />
          ))}
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default MyPosts;
