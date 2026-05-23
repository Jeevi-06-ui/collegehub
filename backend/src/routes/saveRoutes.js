import express from "express";
import { saveComparison, toggleSavedCollege } from "../controllers/saveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { saveCollegeSchema, saveComparisonSchema } from "../validators/collegeValidators.js";

const router = express.Router();

router.post("/college", protect, validate(saveCollegeSchema), toggleSavedCollege);
router.post("/comparison", protect, validate(saveComparisonSchema), saveComparison);

export default router;
