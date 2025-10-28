import express from 'express';
import {getUserDashboardStats} from "../controllers/customerController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/userDashboard', protect, getUserDashboardStats);

export default router;