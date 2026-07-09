import express from "express";
import { adminLogin, deleteReport, deleteUser, getAdmin, getAIUsage, getAnalytics, getDashboardData, getReports, getSettings, getSingleReport, getUsers } from "../contollers/admin.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", verifyAdmin, getAdmin);

router.post("/logout", (req, res) => {
    res.clearCookie("adminToken");

    res.json({
        success: true,
    });
});
router.get('/dashboard', verifyAdmin, getDashboardData)

router.get("/users", verifyAdmin, getUsers);

router.get("/reports", verifyAdmin, getReports);

router.get("/reports/:reportId", verifyAdmin, getSingleReport);

router.delete("/reports/:reportId", verifyAdmin, deleteReport);

router.get("/analytics", verifyAdmin, getAnalytics);

router.delete("/users/:userId", verifyAdmin, deleteUser)

router.get("/ai-usage", verifyAdmin, getAIUsage)

router.get("/settings", verifyAdmin, getSettings);

export default router;