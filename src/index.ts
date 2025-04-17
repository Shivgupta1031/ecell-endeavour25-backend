import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes"
import teamRoutes from "./routes/teamRoutes"
import usernameRoutes from "./routes/UsernameRoute"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"], // Add your frontend URL
  credentials: true
}));

connectDB()

app.use("/api/v1", userRoutes);
app.use("/api/v1", eventRoutes);
app.use("/api/v1", teamRoutes);
app.use("/api/v1", usernameRoutes); 


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
