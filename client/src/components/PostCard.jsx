import React from "react";
import image from "../assets/sandip-karangiya-164vZDZ4MmM-unsplash.jpg";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const PostCard = ({ data, editable = false }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full p-4 border flex gap-6 relative">
      {editable ? (
        <div
          className="absolute right-3 top-1 cursor-pointer"
          onClick={() => navigate(`/edit-post/${data._id}`)}
        >
          <EditOutlined />
        </div>
      ) : null}
      <div className="w-4/12 h-60">
        <img
          src={data?.thumbnail}
          alt="post-image"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="w-8/12 h-60 overflow-hidden flex flex-col gap-2">
        <div
          className="text-2xl font-bold text-gray-700 cursor-pointer"
          onClick={() => navigate(`/post/${data._id}`)}
        >
          {data?.title}
        </div>
        <div className="w-full flex items-center justify-between text-sm text-gray-500">
          <div>Posted at:- {moment(data?.createdOn).format("DD-MMM-YYYY")}</div>
          <div>Category - {data?.category.name}</div>
        </div>
        <div className="text-gray-600">{ReactHtmlParser(data?.post)}</div>
      </div>
    </div>
  );
};

export default PostCard;
