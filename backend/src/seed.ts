import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db";
import {
  User,
  Item,
  Skill,
  Resume,
  Conversation,
  CoverLetter,
} from "./models/index";
import bcrypt from "bcryptjs";

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Skill.deleteMany({}),
    Resume.deleteMany({}),
    Conversation.deleteMany({}),
    CoverLetter.deleteMany({}),
  ]);

  console.log("Creating users...");
  const hashed = await bcrypt.hash("password123", 12);
  const users = await User.create([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashed,
      role: "user",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashed,
      role: "user",
    },
    {
      name: "Carol Davis",
      email: "carol@example.com",
      password: hashed,
      role: "user",
    },
    {
      name: "Demo User",
      email: "demo@example.com",
      password: hashed,
      role: "user",
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    },
  ]);

  console.log("Creating skills...");
  const skillData = [
    {
      userId: users[0]._id,
      name: "JavaScript",
      level: "advanced" as const,
      category: "Web Development",
    },
    {
      userId: users[0]._id,
      name: "React",
      level: "advanced" as const,
      category: "Web Development",
    },
    {
      userId: users[0]._id,
      name: "TypeScript",
      level: "intermediate" as const,
      category: "Web Development",
    },
    {
      userId: users[0]._id,
      name: "Node.js",
      level: "intermediate" as const,
      category: "Backend",
    },
    {
      userId: users[1]._id,
      name: "Python",
      level: "advanced" as const,
      category: "Data Science",
    },
    {
      userId: users[1]._id,
      name: "Machine Learning",
      level: "intermediate" as const,
      category: "AI & ML",
    },
    {
      userId: users[1]._id,
      name: "SQL",
      level: "advanced" as const,
      category: "Data Science",
    },
    {
      userId: users[2]._id,
      name: "Figma",
      level: "expert" as const,
      category: "Design",
    },
    {
      userId: users[2]._id,
      name: "UI/UX",
      level: "advanced" as const,
      category: "Design",
    },
    {
      userId: users[2]._id,
      name: "CSS",
      level: "advanced" as const,
      category: "Web Development",
    },
  ];
  await Skill.create(skillData);

  console.log("Creating items...");
  const items = await Item.create([
    {
      title: "Complete React Masterclass",
      shortDesc:
        "Build production-ready React applications from scratch with hooks, context, and advanced patterns.",
      fullDesc:
        "This comprehensive course covers everything from React fundamentals to advanced patterns like render props, higher-order components, custom hooks, and performance optimization. You will build multiple real-world projects including a dashboard, e-commerce app, and a social media feed. By the end, you will be confident in building scalable React applications.",
      price: 49.99,
      category: "Web Development",
      image: "",
      rating: 4.8,
      createdBy: users[0]._id,
    },
    {
      title: "Node.js Backend Architecture",
      shortDesc:
        "Design and build scalable backend systems with Node.js, Express, and MongoDB.",
      fullDesc:
        "Learn to architect production-ready backend systems. Topics include RESTful API design, authentication strategies, database modeling with MongoDB, caching with Redis, message queues, testing, and deployment. You will build a complete SaaS platform backend with microservices architecture.",
      price: 59.99,
      category: "Web Development",
      image: "",
      rating: 4.6,
      createdBy: users[0]._id,
    },
    {
      title: "Python for Data Science",
      shortDesc:
        "Master Python programming for data analysis, visualization, and machine learning.",
      fullDesc:
        "Dive into Python for data science with NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Work through real datasets, build predictive models, and create stunning visualizations. Includes projects on house price prediction, customer segmentation, and sentiment analysis.",
      price: 44.99,
      category: "Data Science",
      image: "",
      rating: 4.7,
      createdBy: users[1]._id,
    },
    {
      title: "Machine Learning A-Z",
      shortDesc:
        "Hands-on machine learning with Python covering regression, classification, clustering, and deep learning.",
      fullDesc:
        "A comprehensive guide to machine learning algorithms and their implementation. Covers supervised learning (linear regression, decision trees, SVM, neural networks), unsupervised learning (K-means, hierarchical clustering, PCA), and reinforcement learning. Each algorithm is implemented from scratch and with popular libraries.",
      price: 69.99,
      category: "AI & ML",
      image: "",
      rating: 4.9,
      createdBy: users[1]._id,
    },
    {
      title: "UI/UX Design Fundamentals",
      shortDesc:
        "Learn the principles of user interface and user experience design for digital products.",
      fullDesc:
        "Master the art of designing intuitive and beautiful digital products. Learn design thinking, user research, wireframing, prototyping, visual design principles, design systems, and usability testing. Includes Figma projects and a complete portfolio case study.",
      price: 39.99,
      category: "Design",
      image: "",
      rating: 4.5,
      createdBy: users[2]._id,
    },
    {
      title: "DevOps with Docker & Kubernetes",
      shortDesc:
        "Containerize applications and orchestrate them with Kubernetes in production.",
      fullDesc:
        "Learn containerization with Docker and orchestration with Kubernetes. Cover Dockerfiles, multi-stage builds, Docker Compose, Kubernetes pods, services, deployments, ingress, ConfigMaps, secrets, Helm charts, monitoring with Prometheus, and CI/CD pipeline integration.",
      price: 54.99,
      category: "DevOps",
      image: "",
      rating: 4.7,
      createdBy: users[0]._id,
    },
    {
      title: "TypeScript Deep Dive",
      shortDesc:
        "Go from beginner to advanced TypeScript with real-world patterns and best practices.",
      fullDesc:
        "Understand TypeScript deeply — from basic types to advanced concepts like conditional types, mapped types, template literal types, decorators, and declaration files. Build type-safe APIs, configure strict mode, and learn patterns used in production codebases.",
      price: 34.99,
      category: "Web Development",
      image: "",
      rating: 4.8,
      createdBy: users[0]._id,
    },
    {
      title: "Business Strategy for Tech Leaders",
      shortDesc:
        "Develop strategic thinking skills for technical leadership and product management.",
      fullDesc:
        "Bridge the gap between technology and business. Learn strategic planning, market analysis, OKR setting, stakeholder management, product roadmap creation, and data-driven decision making. Includes case studies from leading tech companies.",
      price: 44.99,
      category: "Business",
      image: "",
      rating: 4.3,
      createdBy: users[2]._id,
    },
    {
      title: "Advanced CSS & Animations",
      shortDesc:
        "Create stunning, responsive layouts and smooth animations with modern CSS.",
      fullDesc:
        "Master CSS Grid, Flexbox, custom properties, container queries, and advanced animations. Learn to build complex responsive layouts without frameworks, create smooth scroll-triggered animations, and optimize for performance. Includes a complete design system implementation.",
      price: 29.99,
      category: "Web Development",
      image: "",
      rating: 4.4,
      createdBy: users[2]._id,
    },
    {
      title: "Deep Learning with PyTorch",
      shortDesc:
        "Build neural networks and deep learning models with PyTorch from basics to advanced.",
      fullDesc:
        "Comprehensive deep learning course covering CNNs for image recognition, RNNs/LSTMs for sequence data, transformers for NLP, GANs for image generation, and reinforcement learning. Implement attention mechanisms, transfer learning, and model deployment with TorchServe.",
      price: 79.99,
      category: "AI & ML",
      image: "",
      rating: 4.9,
      createdBy: users[1]._id,
    },
  ]);

  console.log("Creating resumes...");
  await Resume.create([
    {
      userId: users[0]._id,
      content:
        "Experienced full-stack developer with 5+ years building web applications using React, Node.js, and TypeScript. Passionate about clean code, performance optimization, and mentoring junior developers.",
      aiScore: 78,
      suggestions: [
        "Add more quantifiable achievements",
        "Include relevant certifications",
        "Strengthen the summary section",
      ],
    },
    {
      userId: users[1]._id,
      content:
        "Data scientist with strong background in statistical analysis, machine learning, and Python programming. Experienced in building predictive models and data pipelines for business intelligence.",
      aiScore: 82,
      suggestions: [
        "Highlight specific ML projects with metrics",
        "Add technical skills section",
        "Include publication links",
      ],
    },
  ]);

  console.log("Creating conversations...");
  await Conversation.create([
    {
      userId: users[0]._id,
      title: "Career Transition Advice",
      messages: [
        {
          role: "user",
          content:
            "I want to transition from web development to AI/ML. What steps should I take?",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          role: "assistant",
          content:
            "Great question! Start by strengthening your math fundamentals (linear algebra, calculus, statistics), then learn Python and ML libraries. Your web dev background will help with deploying models.",
          timestamp: new Date(Date.now() - 86000000),
        },
        {
          role: "user",
          content: "How long does this transition typically take?",
          timestamp: new Date(Date.now() - 85000000),
        },
        {
          role: "assistant",
          content:
            "With focused effort (10-15 hours/week), most people make the transition in 6-12 months. Start with Andrew Ng's ML course on Coursera.",
          timestamp: new Date(Date.now() - 84500000),
        },
      ],
    },
    {
      userId: users[1]._id,
      title: "Resume Review Request",
      messages: [
        {
          role: "user",
          content: "Can you review my data science resume?",
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          role: "assistant",
          content:
            "I'd be happy to help! Please paste your resume content and I'll provide detailed feedback.",
          timestamp: new Date(Date.now() - 172700000),
        },
      ],
    },
  ]);

  console.log("Creating cover letters...");
  await CoverLetter.create([
    {
      userId: users[0]._id,
      jobTitle: "Senior Frontend Engineer",
      company: "TechCorp Inc.",
      content:
        "Dear Hiring Manager,\n\nI am excited to apply for the Senior Frontend Engineer position at TechCorp Inc. With over 5 years of experience building scalable web applications using React, TypeScript, and Node.js, I am confident in my ability to contribute to your team.\n\nAt my current role, I led the migration of a legacy codebase to a modern React architecture, resulting in a 40% improvement in page load times. I also implemented a component library that reduced development time by 30%.\n\nI look forward to discussing how my skills align with TechCorp's goals.\n\nBest regards,\nAlice Johnson",
    },
    {
      userId: users[1]._id,
      jobTitle: "Data Scientist",
      company: "DataDriven Co.",
      content:
        "Dear Hiring Team,\n\nI am writing to express my strong interest in the Data Scientist role at DataDriven Co. My background in machine learning, statistical analysis, and Python programming makes me an excellent fit for this position.\n\nIn my previous role, I developed a predictive model that improved customer retention by 25%. I have experience with TensorFlow, Scikit-learn, and deploying ML models to production.\n\nI am eager to bring my data expertise to DataDriven Co.\n\nBest regards,\nBob Smith",
    },
  ]);

  console.log("\n--- Seed Complete ---");
  console.log(`Users: ${users.length}`);
  console.log(`Items: ${items.length}`);
  console.log(`Skills: ${skillData.length}`);
  console.log("Demo login: demo@example.com / password123");
  console.log(
    "Other users: alice@example.com, bob@example.com, carol@example.com (all use password123)",
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
