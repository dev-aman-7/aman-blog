import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import axios from "axios";
import { ApiUrl } from "../url";

const PostsList = () => {
  const [blogList, setBlogList] = useState([]);
  const fetchBlogList = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl.blogBaseUrl}?current_page=1&limit=&slug=`
      );

      if (response.status === 200) {
        setBlogList(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBlogList();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-9/12 min-h-screen">
      {blogList?.blogLists?.map((item) => (
        <PostCard data={item} key={item._id} />
      ))}
    </div>
  );
};

export default PostsList;
