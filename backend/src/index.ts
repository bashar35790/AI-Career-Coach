import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index";
import { connectDB } from "./config/db";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";
dotenv.config({ override: true });

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api", (_req, res) => {
  res.json({ success: true, message: "AI Career Coach API" });
});

app.use("/api", routes);

app.use(errorHandler);

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start();
