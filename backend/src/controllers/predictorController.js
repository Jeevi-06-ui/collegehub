import { College } from "../models/College.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const predictColleges = asyncHandler(async (req, res) => {
  const { exam, rank } = req.validated.body;
  const cutoffPath = `cutoffs.${exam}`;

  const colleges = await College.find({
    [cutoffPath]: { $exists: true, $gte: rank }
  })
    .sort({ rating: -1, "placements.averagePackage": -1 })
    .select("name location image rating fees courses placements cutoffs")
    .lean();

  res.status(200).json({
    success: true,
    exam,
    rank,
    total: colleges.length,
    data: colleges
  });
});
