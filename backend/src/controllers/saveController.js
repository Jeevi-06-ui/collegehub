import { College } from "../models/College.js";
import { User } from "../models/User.js";
import { buildComparisonSnapshot } from "./compareController.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateUser = (query) =>
  query.populate([
    {
      path: "savedColleges",
      select: "name location image rating fees placements courses"
    },
    {
      path: "savedComparisons.colleges",
      select: "name location image rating fees placements courses"
    }
  ]);

export const toggleSavedCollege = asyncHandler(async (req, res) => {
  const { collegeId } = req.validated.body;
  const college = await College.findById(collegeId).select("_id");

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  const alreadySaved = req.user.savedColleges.some((id) => id.toString() === collegeId);

  const user = await populateUser(
    User.findByIdAndUpdate(
      req.user._id,
      alreadySaved ? { $pull: { savedColleges: collegeId } } : { $addToSet: { savedColleges: collegeId } },
      { new: true }
    ).select("-password")
  );

  res.status(200).json({
    success: true,
    saved: !alreadySaved,
    user
  });
});

export const saveComparison = asyncHandler(async (req, res) => {
  const uniqueIds = [...new Set(req.validated.body.collegeIds)];
  if (uniqueIds.length !== req.validated.body.collegeIds.length) {
    throw new ApiError(400, "Select different colleges for comparison.");
  }

  const colleges = await College.find({ _id: { $in: uniqueIds } }).select("name location fees rating courses placements");
  if (colleges.length !== uniqueIds.length) {
    throw new ApiError(404, "One or more selected colleges were not found.");
  }

  const orderedColleges = uniqueIds.map((id) => colleges.find((college) => college._id.toString() === id));
  const snapshot = buildComparisonSnapshot(orderedColleges);
  const title = req.validated.body.title || snapshot.map((item) => item.name).join(" vs ");

  const user = await populateUser(
    User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          savedComparisons: {
            title,
            colleges: uniqueIds,
            snapshot
          }
        }
      },
      { new: true }
    ).select("-password")
  );

  res.status(201).json({
    success: true,
    user,
    comparison: user.savedComparisons[user.savedComparisons.length - 1]
  });
});
