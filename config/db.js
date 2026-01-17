import dotenv from "dotenv";
dotenv.config(); 

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD.trim(),
  database: process.env.DB_NAME,
});

pool.query("SELECT 1")
  .then(() => console.log("✅ Database connected"))
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

export default pool;
