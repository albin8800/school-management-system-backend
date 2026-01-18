import express from "express";
import "./config/db.js";
import cors from 'cors'
import adminAuthRoutes from './routes/admin/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminAuthRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
