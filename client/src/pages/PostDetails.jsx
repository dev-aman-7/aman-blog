// components/PostDetails.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { ApiUrl } from "../url";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import CommentCard from "../components/Comments";
import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (comment.trim() !== "") {
        const data = { postId: postId, comment: comment };
        const response = await axios.post(`${ApiUrl.commentBaseUrl}`, data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data.success) {
          console.log(response);
          fetchPostComment();
        }
        setComment("");
      }
    } catch (error) {}
  };

  const fetchBlogById = async () => {
    try {
      const response = await axios.get(`${ApiUrl.blogBaseUrl}/${postId}`);

      if (response.data.success) {
        setPostDetails(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBlogById();
    fetchPostComment();
  }, []);

  const fetchPostComment = async () => {
    try {
      const response = await axios.get(`${ApiUrl.commentBaseUrl}/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setAllComments(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container px-28 mx-auto my-8  mt-20">
        <img
          src={postDetails?.thumbnail}
          alt="Post Cover"
          className="w-full h-96 object-cover mb-4 rounded-lg"
        />

        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">{postDetails?.title}</h1>
          <div className="flex items-center text-gray-600">
            <span className="mr-4">{postDetails?.category?.name}</span>
            {/* <span>By {postDetails?.author}</span> */}
          </div>
          <div className="mt-4 text-gray-700 text-justify">
            {parse(`${postDetails?.post}`)}
          </div>
        </div>
        <div className="mt-10 text-2xl font-bold">Comments</div>
        {isAuthenticated ? (
          <div className="mt-4">
            <form onSubmit={handleSubmit} className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Write a comment:
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={comment}
                onChange={handleCommentChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form>
          </div>
        ) : null}

        <div className="mt-4">
          {allComments?.map((item) => (
            <CommentCard
              fullName={item.user.firstName + " " + item.user.lastName}
              timestamp={item.createdAt}
              comment={item.comment}
              profileImage={item.user.profileImage}
              username={item.user.username}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PostDetails;
