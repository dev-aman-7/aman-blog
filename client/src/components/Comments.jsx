// CommentCard.js
import React from "react";
import moment from "moment";

const CommentCard = ({
  fullName,
  timestamp,
  comment,
  profileImage,
  username,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gray-400 flex items-center justify-center rounded-full mr-2 overflow-hidden object-cover">
            {profileImage ? (
              <img src={profileImage} alt="profile image" className="" />
            ) : (
              fullName.split("")[0]
            )}
          </div>
          <div className="ml-2">
            <div className="font-bold">{fullName}</div>
            <div className="text-sm -mt-1 text-gray-500">@{username}</div>
          </div>
        </div>
        <div className="text-gray-500 text-sm mt-2">
          {moment(timestamp).format("DD MMM YYYY")}
        </div>
      </div>
      <p className="text-gray-700 mt-4">{comment}</p>
    </div>
  );
};

export default CommentCard;
