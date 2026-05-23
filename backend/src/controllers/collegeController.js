import mongoose from "mongoose";
import { College } from "../models/College.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildCollegeQuery = (queryParams) => {
  const query = {};
  const search = queryParams.search || queryParams.q;

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { name: regex },
      { "location.city": regex },
      { "location.state": regex },
      { "courses.name": regex }
    ];
  }

  if (queryParams.location && queryParams.location !== "all") {
    const regex = new RegExp(`^${escapeRegex(queryParams.location)}$`, "i");
    query.$and = [...(query.$and || []), { $or: [{ "location.city": regex }, { "location.state": regex }] }];
  }

  if (queryParams.course && queryParams.course !== "all") {
    query["courses.name"] = new RegExp(escapeRegex(queryParams.course), "i");
  }

  if (queryParams.minFees !== undefined || queryParams.maxFees !== undefined) {
    query.fees = {};
    if (queryParams.minFees !== undefined) query.fees.$gte = Number(queryParams.minFees);
    if (queryParams.maxFees !== undefined) query.fees.$lte = Number(queryParams.maxFees);
  }

  if (queryParams.rating !== undefined) {
    query.rating = { $gte: Number(queryParams.rating) };
  }

  return query;
};

const buildSort = (sortBy = "createdAt", sortOrder = "desc") => {
  const direction = sortOrder === "asc" ? 1 : -1;
  const sortMap = {
    rating: { rating: direction },
    fees: { fees: direction },
    placements: { "placements.averagePackage": direction },
    createdAt: { createdAt: direction }
  };

  return sortMap[sortBy] || sortMap.createdAt;
};

const getFilterOptions = async () => {
  const [locations, courses] = await Promise.all([
    College.distinct("location.city"),
    College.distinct("courses.name")
  ]);

  return {
    locations: locations.sort((a, b) => a.localeCompare(b)),
    courses: courses.sort((a, b) => a.localeCompare(b))
  };
};

export const getColleges = asyncHandler(async (req, res) => {
  const queryParams = req.validated.query;
  const page = Number(queryParams.page || 1);
  const limit = Number(queryParams.limit || 12);
  const skip = (page - 1) * limit;
  const mongoQuery = buildCollegeQuery(queryParams);
  const sort = buildSort(queryParams.sortBy, queryParams.sortOrder);

  const [colleges, total, filters] = await Promise.all([
    College.find(mongoQuery).sort(sort).skip(skip).limit(limit).lean(),
    College.countDocuments(mongoQuery),
    getFilterOptions()
  ]);

  res.status(200).json({
    success: true,
    data: colleges,
    filters,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getCollegeById = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const college = await College.findById(id).lean();

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  const courseNames = college.courses.map((course) => course.name);
  const similarColleges = await College.find({
    _id: { $ne: new mongoose.Types.ObjectId(id) },
    $or: [{ "location.city": college.location.city }, { "courses.name": { $in: courseNames } }]
  })
    .sort({ rating: -1 })
    .limit(3)
    .select("name location image rating fees placements courses")
    .lean();

  res.status(200).json({
    success: true,
    college,
    similarColleges
  });
});

export const searchColleges = asyncHandler(async (req, res) => {
  const q = req.validated.query.q || "";
  const limit = Number(req.validated.query.limit || 8);
  const regex = new RegExp(escapeRegex(q), "i");
  const query = q
    ? {
        $or: [
          { name: regex },
          { "location.city": regex },
          { "location.state": regex },
          { "courses.name": regex }
        ]
      }
    : {};

  const colleges = await College.find(query)
    .sort({ rating: -1 })
    .limit(limit)
    .select("name location image rating fees placements courses")
    .lean();

  res.status(200).json({
    success: true,
    data: colleges
  });
});
