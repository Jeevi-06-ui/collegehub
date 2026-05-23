import express from "express";
import { getComparison } from "../controllers/compareController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { compareSchema } from "../validators/collegeValidators.js";

const router = express.Router();

router.post("/", validate(compareSchema), getComparison);

export default router;
