export type Course = {
  name: string;
  duration: string;
  eligibility: string;
  fee: number;
};

export type Review = {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type College = {
  _id: string;
  name: string;
  location: {
    city: string;
    state: string;
    address: string;
  };
  image: string;
  rating: number;
  fees: number;
  courses: Course[];
  overview: string;
  placements: {
    averagePackage: number;
    highestPackage: number;
    topRecruiters: string[];
  };
  cutoffs?: {
    KCET?: number;
    COMEDK?: number;
    JEE?: number;
  };
  feeStructure?: {
    KCET?: number;
    COMEDK?: number;
    JEE?: number;
    management?: number;
  };
  reviews: Review[];
  createdAt: string;
  updatedAt?: string;
};

export type CollegeSummary = Pick<
  College,
  "_id" | "name" | "location" | "image" | "rating" | "fees" | "placements" | "courses" | "feeStructure"
>;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type CollegeFilters = {
  locations: string[];
  courses: string[];
};

export type CollegeListResponse = {
  success: boolean;
  data: College[];
  filters: CollegeFilters;
  pagination: Pagination;
};

export type CollegeDetailResponse = {
  success: boolean;
  college: College;
  similarColleges: CollegeSummary[];
};

export type SavedComparison = {
  _id: string;
  title: string;
  colleges: CollegeSummary[];
  snapshot: {
    college: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    averagePackage: number;
    highestPackage: number;
    courses: string[];
  }[];
  createdAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  savedColleges: CollegeSummary[];
  savedComparisons: SavedComparison[];
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: User;
};

export type ProfileResponse = {
  success: boolean;
  user: User;
};

export type CollegeQuery = {
  search?: string;
  location?: string;
  minFees?: number | "";
  maxFees?: number | "";
  rating?: number | "";
  course?: string;
  sortBy?: "rating" | "fees" | "placements" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type ComparisonResponse = {
  success: boolean;
  data: CollegeSummary[];
  snapshot: SavedComparison["snapshot"];
  highlights: {
    lowestFees: SavedComparison["snapshot"][number];
    highestRating: SavedComparison["snapshot"][number];
    strongestPlacement: SavedComparison["snapshot"][number];
  };
};

export type Exam = "KCET" | "COMEDK" | "JEE";

export type PredictorResponse = {
  success: boolean;
  exam: Exam;
  rank: number;
  total: number;
  data: CollegeSummary[];
};

export type DiscussionUser = {
  _id: string;
  name: string;
  email: string;
};

export type Answer = {
  _id: string;
  text: string;
  user: DiscussionUser;
  createdAt: string;
};

export type Question = {
  _id: string;
  title: string;
  description: string;
  user: DiscussionUser;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
};

export type QuestionListResponse = {
  success: boolean;
  data: Question[];
  pagination: Pagination;
};

export type QuestionDetailResponse = {
  success: boolean;
  question: Question;
};
