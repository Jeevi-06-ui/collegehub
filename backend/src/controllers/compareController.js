import { College } from "../models/College.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const buildComparisonSnapshot = (colleges) =>
  colleges.map((college) => ({
    college: college._id,
    name: college.name,
    location: `${college.location.city}, ${college.location.state}`,
    fees: college.fees,
    rating: college.rating,
    averagePackage: college.placements.averagePackage,
    highestPackage: college.placements.highestPackage,
    courses: college.courses.map((course) => course.name)
  }));

export const getComparison = asyncHandler(async (req, res) => {
  const uniqueIds = [...new Set(req.validated.body.collegeIds)];
  if (uniqueIds.length !== req.validated.body.collegeIds.length) {
    throw new ApiError(400, "Select different colleges for comparison.");
  }

  const colleges = await College.find({ _id: { $in: uniqueIds } })
    .select("name location image rating fees courses placements")
    .lean();

  if (colleges.length !== uniqueIds.length) {
    throw new ApiError(404, "One or more selected colleges were not found.");
  }

  const orderedColleges = uniqueIds.map((id) => colleges.find((college) => college._id.toString() === id));
  const snapshot = buildComparisonSnapshot(orderedColleges);

  res.status(200).json({
    success: true,
    data: orderedColleges,
    snapshot,
    highlights: {
      lowestFees: snapshot.reduce((best, item) => (item.fees < best.fees ? item : best), snapshot[0]),
      highestRating: snapshot.reduce((best, item) => (item.rating > best.rating ? item : best), snapshot[0]),
      strongestPlacement: snapshot.reduce(
        (best, item) => (item.averagePackage > best.averagePackage ? item : best),
        snapshot[0]
      )
    }
  });
});
