import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { College } from "../models/College.js";
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";

const campusImages = [
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1200&q=80"
];

const courseCatalog = {
  "Computer Science Engineering": {
    duration: "4 years",
    eligibility: "10+2 with Physics, Chemistry and Mathematics"
  },
  "Electronics and Communication": {
    duration: "4 years",
    eligibility: "10+2 with Physics and Mathematics"
  },
  "Mechanical Engineering": {
    duration: "4 years",
    eligibility: "10+2 with Physics, Chemistry and Mathematics"
  },
  "Civil Engineering": {
    duration: "4 years",
    eligibility: "10+2 with Physics, Chemistry and Mathematics"
  },
  "Artificial Intelligence": {
    duration: "4 years",
    eligibility: "10+2 with Mathematics or Computer Science"
  },
  "Data Science": {
    duration: "3 years",
    eligibility: "10+2 with Mathematics"
  },
  MBA: {
    duration: "2 years",
    eligibility: "Bachelor degree with entrance test score"
  },
  BBA: {
    duration: "3 years",
    eligibility: "10+2 from a recognized board"
  },
  BCA: {
    duration: "3 years",
    eligibility: "10+2 with Mathematics or Computer Applications"
  },
  "Commerce and Finance": {
    duration: "3 years",
    eligibility: "10+2 with Commerce, Mathematics or Economics"
  },
  "Design and Technology": {
    duration: "4 years",
    eligibility: "10+2 with portfolio or design aptitude score"
  },
  "Health Sciences": {
    duration: "4 years",
    eligibility: "10+2 with Biology"
  }
};

const recruiterPools = [
  ["Infosys", "TCS", "Wipro", "Accenture", "Capgemini"],
  ["Amazon", "Microsoft", "Flipkart", "PhonePe", "Zoho"],
  ["Deloitte", "KPMG", "EY", "PwC", "HDFC Bank"],
  ["Larsen & Toubro", "Bosch", "Siemens", "Mahindra", "Tata Motors"],
  ["Apollo", "Fortis", "Practo", "MedPlus", "Manipal Hospitals"]
];

const reviews = [
  {
    userName: "Aarav Mehta",
    rating: 4.5,
    comment: "Strong faculty support, useful career workshops, and a placement office that stays active through the season."
  },
  {
    userName: "Diya Rao",
    rating: 4.2,
    comment: "The campus feels practical and student-friendly, with good lab access and active clubs."
  },
  {
    userName: "Kabir Shah",
    rating: 4,
    comment: "Coursework is demanding in a good way, and the alumni network helped with internship leads."
  }
];

const rows = [
  ["Bangalore Institute of Technology", "Bangalore", "Karnataka", 285000, 4.5, 10.8, 32, ["Computer Science Engineering", "Electronics and Communication", "Mechanical Engineering", "MBA"]],
  ["Garden City College of Engineering", "Bangalore", "Karnataka", 210000, 4.1, 7.4, 20, ["Computer Science Engineering", "Civil Engineering", "BCA", "BBA"]],
  ["Silicon Valley Institute of Technology", "Bangalore", "Karnataka", 340000, 4.7, 14.2, 42, ["Computer Science Engineering", "Artificial Intelligence", "Data Science", "MBA"]],
  ["Karnataka School of Management", "Bangalore", "Karnataka", 195000, 4.2, 8.1, 24, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Bengaluru College of Data Science", "Bangalore", "Karnataka", 260000, 4.4, 11.5, 28, ["Data Science", "Artificial Intelligence", "BCA", "Computer Science Engineering"]],
  ["South City Engineering College", "Bangalore", "Karnataka", 175000, 3.9, 6.2, 16, ["Mechanical Engineering", "Civil Engineering", "Electronics and Communication", "BCA"]],
  ["Vidya Vikas Institute Bangalore", "Bangalore", "Karnataka", 155000, 3.8, 5.9, 14, ["BBA", "BCA", "Commerce and Finance", "Data Science"]],
  ["Apex College of Computer Applications", "Bangalore", "Karnataka", 145000, 4.0, 6.8, 18, ["BCA", "Data Science", "Artificial Intelligence", "Commerce and Finance"]],
  ["Nandi Hills Business School", "Bangalore", "Karnataka", 225000, 4.3, 9.2, 26, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Techno Global University Bangalore", "Bangalore", "Karnataka", 310000, 4.6, 12.7, 36, ["Computer Science Engineering", "Artificial Intelligence", "Electronics and Communication", "Design and Technology"]],
  ["Chennai Institute of Technology", "Chennai", "Tamil Nadu", 250000, 4.4, 9.6, 30, ["Computer Science Engineering", "Electronics and Communication", "Mechanical Engineering", "Artificial Intelligence"]],
  ["Marina College of Engineering", "Chennai", "Tamil Nadu", 185000, 4.0, 6.7, 18, ["Civil Engineering", "Mechanical Engineering", "Electronics and Communication", "BCA"]],
  ["Madras School of Computer Science", "Chennai", "Tamil Nadu", 230000, 4.3, 8.8, 25, ["Computer Science Engineering", "Data Science", "BCA", "Artificial Intelligence"]],
  ["Tamil Nadu Business Institute", "Chennai", "Tamil Nadu", 165000, 4.1, 7.1, 19, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Coromandel Institute of Design and Tech", "Chennai", "Tamil Nadu", 275000, 4.2, 7.8, 21, ["Design and Technology", "Computer Science Engineering", "Artificial Intelligence", "BBA"]],
  ["Velachery Engineering College", "Chennai", "Tamil Nadu", 155000, 3.9, 5.8, 15, ["Mechanical Engineering", "Civil Engineering", "Electronics and Communication", "BCA"]],
  ["East Coast College of Management", "Chennai", "Tamil Nadu", 205000, 4.2, 8.0, 22, ["MBA", "BBA", "Commerce and Finance", "Design and Technology"]],
  ["Chennai Health Sciences College", "Chennai", "Tamil Nadu", 190000, 4.0, 5.7, 14, ["Health Sciences", "Data Science", "BBA", "Commerce and Finance"]],
  ["Adyar Institute of Analytics", "Chennai", "Tamil Nadu", 245000, 4.5, 10.4, 29, ["Data Science", "Artificial Intelligence", "Computer Science Engineering", "BCA"]],
  ["Bayline Polytechnic and Engineering", "Chennai", "Tamil Nadu", 135000, 3.7, 4.9, 12, ["Civil Engineering", "Mechanical Engineering", "Electronics and Communication", "BCA"]],
  ["Hyderabad Institute of Engineering", "Hyderabad", "Telangana", 240000, 4.3, 9.0, 27, ["Computer Science Engineering", "Electronics and Communication", "Civil Engineering", "MBA"]],
  ["Deccan School of Technology", "Hyderabad", "Telangana", 280000, 4.5, 10.9, 31, ["Computer Science Engineering", "Artificial Intelligence", "Data Science", "Design and Technology"]],
  ["Cyberabad College of Computer Science", "Hyderabad", "Telangana", 260000, 4.4, 11.2, 34, ["Computer Science Engineering", "BCA", "Data Science", "Artificial Intelligence"]],
  ["Telangana Institute of Management", "Hyderabad", "Telangana", 175000, 4.0, 7.3, 19, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Charminar Engineering College", "Hyderabad", "Telangana", 160000, 3.9, 5.6, 14, ["Mechanical Engineering", "Civil Engineering", "Electronics and Communication", "BCA"]],
  ["Gachibowli Data Science Academy", "Hyderabad", "Telangana", 320000, 4.7, 13.8, 40, ["Data Science", "Artificial Intelligence", "Computer Science Engineering", "MBA"]],
  ["Nizam College of Business Studies", "Hyderabad", "Telangana", 150000, 3.8, 5.4, 13, ["BBA", "MBA", "Commerce and Finance", "BCA"]],
  ["HITEC City Institute of Technology", "Hyderabad", "Telangana", 335000, 4.6, 12.9, 36, ["Computer Science Engineering", "Artificial Intelligence", "Electronics and Communication", "Data Science"]],
  ["Pearl City University", "Hyderabad", "Telangana", 220000, 4.1, 7.5, 20, ["Design and Technology", "BBA", "BCA", "Commerce and Finance"]],
  ["Secunderabad College of Engineering", "Hyderabad", "Telangana", 140000, 3.7, 4.8, 11, ["Civil Engineering", "Mechanical Engineering", "Electronics and Communication", "BCA"]],
  ["Delhi Institute of Technology and Management", "Delhi", "Delhi", 300000, 4.5, 11.7, 35, ["Computer Science Engineering", "Artificial Intelligence", "MBA", "Electronics and Communication"]],
  ["Capital College of Engineering", "Delhi", "Delhi", 210000, 4.0, 7.0, 18, ["Civil Engineering", "Mechanical Engineering", "Computer Science Engineering", "BCA"]],
  ["Yamuna School of Computer Science", "Delhi", "Delhi", 250000, 4.3, 9.4, 26, ["Computer Science Engineering", "Data Science", "BCA", "Artificial Intelligence"]],
  ["North Delhi Business School", "Delhi", "Delhi", 185000, 4.1, 7.9, 21, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Indraprastha Institute of Applied Sciences", "Delhi", "Delhi", 270000, 4.4, 8.9, 25, ["Health Sciences", "Data Science", "Artificial Intelligence", "Commerce and Finance"]],
  ["New Delhi Analytics College", "Delhi", "Delhi", 295000, 4.6, 12.0, 33, ["Data Science", "Artificial Intelligence", "Computer Science Engineering", "MBA"]],
  ["Connaught Place School of Management", "Delhi", "Delhi", 235000, 4.2, 8.6, 24, ["MBA", "BBA", "Commerce and Finance", "Design and Technology"]],
  ["Ridgeview Engineering College", "Delhi", "Delhi", 155000, 3.8, 5.2, 13, ["Mechanical Engineering", "Civil Engineering", "Electronics and Communication", "BCA"]],
  ["Dwarka Institute of Technology", "Delhi", "Delhi", 245000, 4.1, 7.6, 20, ["Computer Science Engineering", "Electronics and Communication", "BCA", "Data Science"]],
  ["South Delhi College of Commerce and Tech", "Delhi", "Delhi", 170000, 3.9, 6.4, 16, ["Commerce and Finance", "BBA", "BCA", "Data Science"]],
  ["Mumbai Institute of Technology", "Mumbai", "Maharashtra", 330000, 4.6, 12.5, 38, ["Computer Science Engineering", "Artificial Intelligence", "Electronics and Communication", "MBA"]],
  ["Western Coast Engineering College", "Mumbai", "Maharashtra", 205000, 4.0, 7.2, 19, ["Mechanical Engineering", "Civil Engineering", "Electronics and Communication", "BCA"]],
  ["Powai School of Data Science", "Mumbai", "Maharashtra", 310000, 4.7, 14.0, 41, ["Data Science", "Artificial Intelligence", "Computer Science Engineering", "Commerce and Finance"]],
  ["Bandra Business School", "Mumbai", "Maharashtra", 245000, 4.3, 9.1, 27, ["MBA", "BBA", "Commerce and Finance", "Design and Technology"]],
  ["Navi Mumbai Institute of Engineering", "Mumbai", "Maharashtra", 190000, 3.9, 6.0, 15, ["Civil Engineering", "Mechanical Engineering", "Electronics and Communication", "BCA"]],
  ["Marine Drive College of Management", "Mumbai", "Maharashtra", 225000, 4.2, 8.3, 23, ["MBA", "BBA", "Commerce and Finance", "Data Science"]],
  ["Thane Institute of Computer Applications", "Mumbai", "Maharashtra", 150000, 3.8, 5.5, 14, ["BCA", "Data Science", "Artificial Intelligence", "Commerce and Finance"]],
  ["Andheri College of Applied Technology", "Mumbai", "Maharashtra", 265000, 4.4, 10.2, 30, ["Computer Science Engineering", "Design and Technology", "Artificial Intelligence", "BBA"]],
  ["Mumbai School of Finance and Analytics", "Mumbai", "Maharashtra", 275000, 4.5, 10.7, 31, ["Commerce and Finance", "Data Science", "MBA", "BBA"]],
  ["Gateway Institute of Technology", "Mumbai", "Maharashtra", 235000, 4.1, 7.7, 21, ["Computer Science Engineering", "Electronics and Communication", "BCA", "Data Science"]]
];

const buildCourses = (courseNames, baseFees) =>
  courseNames.map((name, index) => ({
    name,
    duration: courseCatalog[name].duration,
    eligibility: courseCatalog[name].eligibility,
    fee: Math.round(baseFees * (0.82 + index * 0.08))
  }));

const buildCutoffs = (rating, index) => {
  const strength = Math.max(0, Math.round((5 - rating) * 12000));
  return {
    KCET: 2500 + strength + index * 650,
    COMEDK: 1800 + Math.round(strength * 0.8) + index * 520,
    JEE: 9000 + Math.round(strength * 1.6) + index * 1100
  };
};

const buildCollege = (row, index) => {
  const [name, city, state, fees, rating, averagePackage, highestPackage, courseNames] = row;
  const recruiterPool = recruiterPools[index % recruiterPools.length];

  return {
    name,
    location: {
      city,
      state,
      address: `${12 + index}, Knowledge Park Road, ${city}`
    },
    image: campusImages[index % campusImages.length],
    rating,
    fees,
    courses: buildCourses(courseNames, fees),
    overview: `${name} is a ${city}-based institution with career-focused programs, modern labs, industry projects, and student support for internships, placements, and higher studies.`,
    placements: {
      averagePackage,
      highestPackage,
      topRecruiters: recruiterPool
    },
    cutoffs: buildCutoffs(rating, index),
    reviews: reviews.map((review, reviewIndex) => ({
      ...review,
      rating: Math.min(5, Number((review.rating + (rating - 4.1) * 0.25 - reviewIndex * 0.05).toFixed(1)))
    }))
  };
};

const seed = async () => {
  await connectDB();

  await Promise.all([College.deleteMany({}), Question.deleteMany({}), User.deleteMany({})]);

  const colleges = await College.insertMany(rows.map(buildCollege));
  const savedColleges = colleges.slice(0, 3).map((college) => college._id);

  const demoUser = await User.create({
    name: "Demo Student",
    email: "demo@collegehub.dev",
    password: "Password123",
    savedColleges,
    savedComparisons: [
      {
        title: "Top Bangalore shortlist",
        colleges: savedColleges,
        snapshot: colleges.slice(0, 3).map((college) => ({
          college: college._id,
          name: college.name,
          location: `${college.location.city}, ${college.location.state}`,
          fees: college.fees,
          rating: college.rating,
          averagePackage: college.placements.averagePackage,
          highestPackage: college.placements.highestPackage,
          courses: college.courses.map((course) => course.name)
        }))
      }
    ]
  });

  await Question.insertMany([
    {
      title: "How should I choose between placements and fees?",
      description:
        "I shortlisted a few colleges with different fees and average packages. What is a sensible way to compare value before finalizing?",
      user: demoUser._id,
      answers: [
        {
          text: "Start with total four-year cost, then compare average package, internship access, location, and course fit. A lower-fee college with decent placements can be better value than a higher-fee college with only a small placement advantage.",
          user: demoUser._id
        }
      ]
    },
    {
      title: "Can I use predictor results as final admission advice?",
      description:
        "The predictor shows colleges for my rank. Should I treat the recommendations as guaranteed admission options?",
      user: demoUser._id,
      answers: [
        {
          text: "Use predictor results as a shortlist, not a guarantee. Actual cutoffs change every year by category, branch, seat matrix, and counselling round.",
          user: demoUser._id
        }
      ]
    }
  ]);

  console.log(`Seeded ${colleges.length} colleges, sample discussions, and demo user demo@collegehub.dev / Password123`);
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.connection.close();
  process.exit(1);
});
