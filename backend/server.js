import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// 🟢 Import routes AFTER creating app and connecting DB
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();
connectDB();

const app = express(); // ✅ app defined BEFORE use()

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

