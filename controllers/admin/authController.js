import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';

export const adminLogin = async (req, res) => {
    try {
        const { user_id, password} = req.body;

        if(!user_id || !password) {
            return res.status(400).json({ message: "All fields are Requires"});
        }

        const result = await pool.query(
            `SELECT id, user_id, password_hash, is_active, is_deleted
             FROM admins
             WHERE user_id = $1`,
             [user_id]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Invalid Credentials "});
        }
        const admin = result.rows[0];

        if (!admin.is_active || admin.is_deleted) {
            return res.status(403).json({ message: "Admin access disabled" });
        }

        const isMatch = await bcrypt.compare(
            password.trim(),
            admin.password_hash
        )

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            { adminId: admin.id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        );

        return res.status(200).json({
            message: "Login Successfull",
            token,
        });


    } catch (error) {
        console.error("Admin login error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}