import Order from "../models/Order.js";
import SavedListings from "../models/SavedListings.js";


export const getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const [orders, saved] = await Promise.all([
            Order.countDocuments({ user: userId, status: "pending" }),
            SavedListings.countDocuments({ user: userId }),
        ]);

        res.json({ orders, saved });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
};