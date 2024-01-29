// PostEditor.js
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { ApiUrl } from "../url";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const data = new FormData();

      data.append("title", title);
      data.append("slug", slug);
      data.append("category", category);
      data.append("post", content);
      data.append("thumbnail", thumbnail);

      const response = await axios.post(`${ApiUrl.blogBaseUrl}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);

      const data = {};

      if (title) {
        data.title = title;
      }
      if (slug) {
        data.slug = slug;
      }
      if (category) {
        data.category = category;
      }
      if (content) {
        data.content = content;
      }

      const response = await axios.put(
        `${ApiUrl.blogBaseUrl}/${postId}`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.success) {
        navigate("/my-posts");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${ApiUrl.categorycaBaseUrl}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setCategoryList(response.data.data);
      }
    } catch (error) {}
  };

  const getPostById = async () => {
    try {
      const response = await axios.get(`${ApiUrl.blogBaseUrl}/${postId}`);
      setSlug(response.data.data.slug);
      setTitle(response.data.data.title);
      setContent(response.data.data.post);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategoryList();
    if (postId) {
      getPostById();
    }
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-md shadow-md">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <form>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 p-2 w-full border rounded-md"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-600"
            >
              Slug:
            </label>
            <input
              type="text"
              id="slug"
              className="mt-1 p-2 w-full border rounded-md"
              value={slug}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600"
            >
              Category:
            </label>
            <select
              id="category"
              className="mt-1 p-2 w-full border rounded-md"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categoryList?.map((item) => (
                <option value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-600"
            >
              Thumbnail:
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-600"
            >
              Content:
            </label>
            <ReactQuill
              id="content"
              className="mt-2 border rounded-md"
              value={content}
              style={{ height: "300px" }}
              onChange={handleContentChange}
            />
          </div>

          <div className="mt-16">
            {postId ? (
              <button
                onClick={() => handleEdit()}
                className="bg-blue-500 text-white px-4 py-2 min-w-32 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Edit"}
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default PostEditor;
