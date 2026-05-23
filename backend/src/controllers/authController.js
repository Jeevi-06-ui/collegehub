import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { clearTokenCookie, sendTokenCookie } from "../utils/sendTokenCookie.js";

const userPopulation = [
  {
    path: "savedColleges",
    select: "name location image rating fees placements courses"
  },
  {
    path: "savedComparisons.colleges",
    select: "name location image rating fees placements courses"
  }
];

const sendAuthResponse = async (res, user, statusCode) => {
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  const populatedUser = await User.findById(user._id).select("-password").populate(userPopulation);

  res.status(statusCode).json({
    success: true,
    token,
    user: populatedUser
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({ name, email, password });
  await sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  await sendAuthResponse(res, user, 200);
});

export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate(userPopulation);

  res.status(200).json({
    success: true,
    user
  });
});
