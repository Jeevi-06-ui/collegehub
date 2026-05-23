import express from "express";
import { predictColleges } from "../controllers/predictorController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { predictorSchema } from "../validators/predictorValidators.js";

const router = express.Router();

router.post("/", validate(predictorSchema), predictColleges);

export default router;
