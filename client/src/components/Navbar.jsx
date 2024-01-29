import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { isAuthenticated, logout, loggedInUser } = useAuth();
  const menuItem = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Posts",
      link: "/my-posts",
    },
    {
      name: "Profile",
      link: "/my-account",
    },
  ];

  const handleMenuClick = (e) => {
    // Handle menu item click events here
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => logout()}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-full p-4 px-28 bg-slate-300 z-20 fixed top-0 left-0 flex justify-between">
      <div>Hasi Lok</div>
      <div className="cursor-pointer flex items-center gap-5">
        {/* <MenuIcon /> */}
        <ul className="flex items-center gap-5">
          {menuItem.map((item) => (
            <li className="cursor-pointer" key={item.name}>
              <Link to={item.link}>{item.name}</Link>
            </li>
          ))}

          {isAuthenticated ? (
            <li className="cursor-pointer">
              <Link to={"/create-post"}>Create Post</Link>
            </li>
          ) : (
            <li className="cursor-pointer">
              <Link to={"/signup"}>Signup</Link>
            </li>
          )}
        </ul>
        {isAuthenticated ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <span className="cursor-pointer">
              {
                <img
                  src={loggedInUser?.profileImage}
                  className="w-7 h-7 rounded-full object-cover"
                />
              }
            </span>
          </Dropdown>
        ) : (
          <p>
            <Link to={"/login"}>Login</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Navbar;
