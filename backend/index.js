import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ===== ES Modules __dirname workaround =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : "http://localhost:5173",
    credentials: true,
  })
);

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  // Catch-all middleware for SPA
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ===== Start Server + Connect DB =====
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});



