import express from "express";
import "./config/db.js";
import cors from 'cors'
import adminAuthRoutes from './routes/admin/authRoutes.js';
import adminDashboardRoutes from './routes/admin/adminDashboardRoutes.js'
import adminStudentsRoutes from './routes/admin/adminStudents.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminAuthRoutes);

app.use('/api/admin/dashboard', adminDashboardRoutes);

app.use('/api/admin/students', adminStudentsRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
