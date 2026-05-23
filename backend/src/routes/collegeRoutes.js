import express from "express";
import { getCollegeById, getColleges, searchColleges } from "../controllers/collegeController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { collegeIdSchema, collegeListSchema, collegeSearchSchema } from "../validators/collegeValidators.js";

const router = express.Router();

router.get("/", validate(collegeListSchema), getColleges);
router.get("/search", validate(collegeSearchSchema), searchColleges);
router.get("/:id", validate(collegeIdSchema), getCollegeById);

export default router;
