import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    answers: {
      type: [answerSchema],
      default: []
    }
  },
  { timestamps: true }
);

questionSchema.index({
  title: "text",
  description: "text"
});

export const Question = mongoose.model("Question", questionSchema);
