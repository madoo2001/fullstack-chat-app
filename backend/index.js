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
  // ❗ الباث النهائي والصحيح
  // __dirname = backend/
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  // catch-all لأي route (SPA)
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ===== Start Server + Connect DB =====
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});


