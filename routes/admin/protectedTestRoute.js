import express from 'express';
import adminAuthMiddleware from '../../middleware/adminAuthMiddleware.js';


const router = express.Router();

router.get("/protected", adminAuthMiddleware, (req, res) => {
    res.status(200).json({
        message: "Admin access granted",
        admin: req.admin,
    });
})

export default router;