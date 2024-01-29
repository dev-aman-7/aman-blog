import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Hasilok</h3>
            <p className="text-sm">Your Blogging Platform</p>
          </div>
          <div className="flex space-x-4">
            <a href="#home" className="hover:text-gray-500">
              Home
            </a>
            <a href="#about" className="hover:text-gray-500">
              About
            </a>
            <a href="#blog" className="hover:text-gray-500">
              Blog
            </a>
            <a href="#contact" className="hover:text-gray-500">
              Contact
            </a>
          </div>
        </div>
        <hr className="my-4 border-gray-600" />
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Hasilok. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
