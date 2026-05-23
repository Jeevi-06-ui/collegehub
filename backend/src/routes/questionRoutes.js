import express from "express";
import {
  answerQuestion,
  createQuestion,
  getQuestionById,
  getQuestions
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  answerQuestionSchema,
  createQuestionSchema,
  questionIdSchema,
  questionListSchema
} from "../validators/questionValidators.js";

const router = express.Router();

router.get("/", validate(questionListSchema), getQuestions);
router.post("/", protect, validate(createQuestionSchema), createQuestion);
router.get("/:id", validate(questionIdSchema), getQuestionById);
router.post("/:id/answer", protect, validate(answerQuestionSchema), answerQuestion);

export default router;
