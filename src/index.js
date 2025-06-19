
import authRoutes from "./routes/auth.routes.js";
import express from "express";
import "dotenv/config";
import bookRoutes from "./routes/bookRoutes.js";

// Add this line
import { connectDB } from "./lib/db.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});