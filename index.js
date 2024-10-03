import express from "express";
import connectDB from "./server.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
//console.clear();
//ROUTES//
import { authRouter } from "./routers/authRouter.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

//API//
app.use("/", authRouter);
app.get("/", (req, res) => {
  res.send("Hello from Backend");
});
app.listen(
  process.env.PORT || 8000,
  connectDB(process.env.MONGO_DB_URL),
  () => {
    console.log("Server is running on port 8000");
  }
);
