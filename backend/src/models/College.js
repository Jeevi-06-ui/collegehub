import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    fee: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
        index: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      address: {
        type: String,
        required: true,
        trim: true
      }
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      index: true
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    courses: {
      type: [courseSchema],
      default: []
    },
    overview: {
      type: String,
      required: true,
      trim: true
    },
    placements: {
      averagePackage: {
        type: Number,
        required: true,
        min: 0,
        index: true
      },
      highestPackage: {
        type: Number,
        required: true,
        min: 0
      },
      topRecruiters: {
        type: [String],
        default: []
      }
    },
    cutoffs: {
      KCET: {
        type: Number,
        min: 1
      },
      COMEDK: {
        type: Number,
        min: 1
      },
      JEE: {
        type: Number,
        min: 1
      }
    },
    feeStructure: {
      KCET: {
        type: Number,
        min: 0
      },
      COMEDK: {
        type: Number,
        min: 0
      },
      JEE: {
        type: Number,
        min: 0
      },
      management: {
        type: Number,
        min: 0
      }
    },
    reviews: {
      type: [reviewSchema],
      default: []
    }
  },
  { timestamps: true }
);

collegeSchema.index({
  name: "text",
  "location.city": "text",
  "location.state": "text",
  "courses.name": "text"
});

export const College = mongoose.model("College", collegeSchema);
