import { Question } from "../models/Question.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userSelect = "name email";

const buildQuestionQuery = (search) => {
  if (!search) return {};

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return {
    $or: [{ title: regex }, { description: regex }]
  };
};

export const getQuestions = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.validated.query;
  const skip = (Number(page) - 1) * Number(limit);
  const query = buildQuestionQuery(search);

  const [questions, total] = await Promise.all([
    Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", userSelect)
      .populate("answers.user", userSelect)
      .lean(),
    Question.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: questions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create({
    title: req.validated.body.title,
    description: req.validated.body.description,
    user: req.user._id
  });

  const populatedQuestion = await Question.findById(question._id).populate("user", userSelect).lean();

  res.status(201).json({
    success: true,
    question: populatedQuestion
  });
});

export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.validated.params.id)
    .populate("user", userSelect)
    .populate("answers.user", userSelect)
    .lean();

  if (!question) {
    throw new ApiError(404, "Question not found.");
  }

  res.status(200).json({
    success: true,
    question
  });
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.validated.params.id);

  if (!question) {
    throw new ApiError(404, "Question not found.");
  }

  question.answers.push({
    text: req.validated.body.text,
    user: req.user._id
  });

  await question.save();

  const populatedQuestion = await Question.findById(question._id)
    .populate("user", userSelect)
    .populate("answers.user", userSelect)
    .lean();

  res.status(201).json({
    success: true,
    question: populatedQuestion
  });
});
