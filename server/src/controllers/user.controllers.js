import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cookieOption } from "../constants.js";
import mailer from "../utils/Mailer.js";
import { Otp } from "../models/otp.model.js";
import { generateOtp } from "../utils/GenerateOtp.js";
import moment from "moment";
import mongoose from "mongoose";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        500,
        "User not found while generating access and refresh token"
      );
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const signup = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!(username && firstName && lastName && email && password)) {
    throw new ApiError(400, "All fields are required");
  }

  //   check if username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with given username or email");
  }

  const profileImageLocalPath = req.files?.profileImage[0].path;

  if (!profileImageLocalPath) {
    throw new ApiError(400, "Profile image is missing");
  }

  const profileImage = await uploadOnCloudinary(profileImageLocalPath);

  const user = await User.create({
    firstName,
    lastName,
    username,
    password,
    email,
    profileImage: profileImage.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  const generatedOTP = generateOtp();

  const otp = new Otp({
    user: user._id,
    email: user.email,
    otp: generatedOTP,
    expires_at: moment().add(5, "minutes").toDate(),
  });

  await otp.save();

  mailer({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify your account",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a
          href=""
          style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
        >
          HASI LOK
        </a>
      </div>
      <p style="font-size:1.1em">Hi, ${user.firstName} ${user.lastName}</p>
      <p>
        Thank you for choosing HASILOK. Use the following OTP to complete
        your Sign Up procedures. OTP is valid for 5 minutes
      </p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
        ${generatedOTP}
      </h2>
      <p style="font-size:0.9em;">
        Regards,
        <br />
        Hasi Lok
      </p>
      <hr style="border:none;border-top:1px solid #eee" />
    </div>
  </div>`,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User sign up successfully"));
});

const verifyUserEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!(email || otp)) throw new ApiError(400, "All fields are required");

  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(400, "Invalid email");
  }

  const dbOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!dbOtp) {
    throw new ApiError(400, "OTP is expired. Please regenerate new OTP");
  }

  if (otp !== parseInt(dbOtp.otp)) {
    throw new ApiError(400, "OTP is incorrect");
  }
  user.isEmailVarified = true;
  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User email varified successfully"));
});

const generateNewOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(400, "Invalid email");
  }

  const generatedOTP = generateOtp();
  const otpExpirationTime = moment().add(5, "minutes").toDate();

  const otp = new Otp({
    user: user._id,
    email: user.email,
    otp: generatedOTP,
    expires_at: otpExpirationTime,
  });

  await otp.save();

  mailer({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify your account",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a
          href=""
          style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
        >
          HASI LOK
        </a>
      </div>
      <p style="font-size:1.1em">Hi, ${user.firstName} ${user.lastName}</p>
      <p>
        Thank you for choosing HASILOK. Use the following OTP to complete
        your Sign Up procedures. OTP is valid for 5 minutes
      </p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
        ${generatedOTP}
      </h2>
      <p style="font-size:0.9em;">
        Regards,
        <br />
        Hasi Lok
      </p>
      <hr style="border:none;border-top:1px solid #eee" />
    </div>
  </div>`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "OTP sent successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(400, "User not registered with given email or username");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(String(password));

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user?._id
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  user.password = undefined;
  user.refreshToken = undefined;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(
      new ApiResponse(
        200,
        {
          user,
          refreshToken,
          accessToken,
        },
        "Logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user._id);

  if (!user) {
    throw new ApiError(400, "Please login first");
  }
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(new ApiResponse(200, {}, "Log out successfully"));
});

const updateAccount = asyncHandler(async (req, res) => {
  const { email, username, firstName, lastName } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(400, "No user found");
  }

  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (email) {
    const exiestingEmail = await User.findOne({ email });

    if (exiestingEmail !== null) {
      throw new ApiError(409, "User already exists with this email");
    }

    user.email = email;
    user.isEmailVarified = false;

    const generatedOTP = generateOtp();

    const otp = new Otp({
      user: user._id,
      email: user.email,
      otp: generatedOTP,
      expires_at: moment().add(5, "minutes").toDate(),
    });

    await otp.save();

    mailer({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify your account",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a
            href=""
            style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
          >
            HASI LOK
          </a>
        </div>
        <p style="font-size:1.1em">Hi, ${user.firstName} ${user.lastName}</p>
        <p>
          Thank you for choosing HASILOK. Use the following OTP to complete
          your Sign Up procedures. OTP is valid for 5 minutes
        </p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
          ${generatedOTP}
        </h2>
        <p style="font-size:0.9em;">
          Regards,
          <br />
          Hasi Lok
        </p>
        <hr style="border:none;border-top:1px solid #eee" />
      </div>
    </div>`,
    });
  }
  if (username) {
    const exiestingEmail = await User.findOne({ username });

    if (exiestingEmail) {
      throw new ApiError(409, "User already exists with this email");
    }

    user.username = username;
  }

  await user.save();

  user.password = undefined;
  user.refreshToken = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User account updated successfully"));
});

export {
  signup,
  verifyUserEmail,
  generateNewOtp,
  login,
  logout,
  updateAccount,
};
