import express from "express";
import "./config/db.js";
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
