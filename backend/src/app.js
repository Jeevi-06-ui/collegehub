import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env, isProduction } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import predictorRoutes from "./routes/predictorRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import saveRoutes from "./routes/saveRoutes.js";

const app = express();

const allowedOrigins = env.frontendUrl
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

if (!isProduction) {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CollegeHub API is running"
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CollegeHub API is healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/predictor", predictorRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/save", saveRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
