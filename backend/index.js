import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ROOT_DIR = path.resolve(); // root folder of project

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true // allow any origin in production
        : "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Correct path to dist folder
  const distPath = path.join(ROOT_DIR, "frontend", "dist");

  app.use(express.static(distPath));

  // Catch-all middleware for SPA routing
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server + connect DB
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

