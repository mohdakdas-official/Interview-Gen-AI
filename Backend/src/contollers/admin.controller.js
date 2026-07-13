import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/users.model.js";
import { interviewReportModel } from "../models/interviewReport.model.js";



export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        const token = jwt.sign(
            { admin: true },
            process.env.JWT_SECRETS,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // production me true
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getAdmin = (req, res) => {
    res.json({
        success: true,
        admin: {
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME,
            role: process.env.ADMIN_ROLE,
        },
    });
};

export const getDashboardData = async (req, res) => {
    try {
        // ==========================
        // USERS
        // ==========================
        const today = new Date();

        const start = new Date(today);
        start.setHours(0, 0, 0, 0);

        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        const [
            totalUsers,
            verifiedUsers,
            recentUsers,
            monthlyUsers,
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                isVerified: true,
            }),

            User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("username email createdAt"),

            User.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate() - 6
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            day: {
                                $dayOfWeek: "$createdAt",
                            },
                        },
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.day": 1,
                    },
                },
            ]),
        ]);

        // ==========================
        // REPORTS
        // ==========================

        const [
            totalReports,
            todayReports,
            recentReports,
            averageMatch,
            reportGraph,
        ] = await Promise.all([
            interviewReportModel.countDocuments(),

            interviewReportModel.countDocuments({
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            }),

            interviewReportModel.find()
                .populate("user", "username email")
                .sort({ createdAt: -1 })
                .limit(5),

            interviewReportModel.aggregate([
                {
                    $group: {
                        _id: null,
                        average: {
                            $avg: "$matchScore",
                        },
                    },
                },
            ]),

            interviewReportModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate() - 6
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            day: {
                                $dayOfWeek: "$createdAt",
                            },
                        },
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.day": 1,
                    },
                },
            ]),
        ]);

        // ==========================
        // RECENT USERS + REPORT COUNT
        // ==========================

        const recentUsersWithCount = await Promise.all(
            recentUsers.map(async (user) => ({
                user,
                createdAt: user.createdAt,
                reportsCount: await interviewReportModel.countDocuments({
                    user: user._id,
                }),
            }))
        );

        // ==========================
        // FORMAT GRAPH DATA
        // ==========================

        const dayNames = [
            "",
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ];

        const formattedMonthlyUsers = monthlyUsers.map((item) => ({
            day: dayNames[item._id.day],
            users: item.total,
        }));

        const formattedReportGraph = reportGraph.map((item) => ({
            day: dayNames[item._id.day],
            reports: item.total,
        }));

        // ==========================
        // STORAGE
        // ==========================

        const db = mongoose.connection.db;

        const stats = await db.command({
            collStats: interviewReportModel.collection.collectionName,
        });

        const storageUsed = (
            stats.storageSize /
            1024 /
            1024
        ).toFixed(2);

        // ==========================
        // AI REQUESTS
        // ==========================

        const aiRequests = totalReports;

        // ==========================
        // SUCCESS RATE
        // ==========================

        const successRate =
            averageMatch.length > 0
                ? Number(averageMatch[0].average).toFixed(1)
                : 0;

        // ==========================
        // SYSTEM HEALTH
        // ==========================

        const systemHealth = {
            api: true,
            database: mongoose.connection.readyState === 1,
            server: process.uptime() > 0,

            uptime: Math.floor(process.uptime()),

            memory: Math.round(
                process.memoryUsage().heapUsed / 1024 / 1024
            ),
        };

        // ==========================
        // RESPONSE
        // ==========================

        return res.status(200).json({
            success: true,
            dashboard: {
                cards: {
                    totalUsers,
                    verifiedUsers,
                    activeUsers: verifiedUsers,

                    totalReports,
                    todayReports,

                    aiRequests,

                    storageUsed,

                    averageMatchScore: successRate,
                },

                systemHealth,

                // ✅ Fixed
                recentUsers: recentUsersWithCount,

                // Latest Reports
                recentReports,

                graphs: {
                    monthlyUsers: formattedMonthlyUsers,
                    reportGraph: formattedReportGraph,
                },
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getUsers = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            filter = "all",
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = {};
        let sort = { createdAt: -1 };

        // ==========================
        // SEARCH
        // ==========================
        if (search) {
            query.$or = [
                {
                    username: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // ==========================
        // FILTERS
        // ==========================
        switch (filter) {
            case "verified":
                query.isVerified = true;
                break;

            case "unverified":
                query.isVerified = false;
                break;

            case "acceptedTerms":
                query.isAcceptTermsConditions = true;
                break;

            case "notAcceptedTerms":
                query.isAcceptTermsConditions = false;
                break;

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "newest":
            case "all":
            default:
                sort = { createdAt: -1 };
                break;
        }

        const [
            users,
            totalUsers,
            verifiedUsers,
            unverifiedUsers,
        ] = await Promise.all([
            User.aggregate([
                {
                    $match: query,
                },

                {
                    $lookup: {
                        from: "interviewreports",
                        localField: "_id",
                        foreignField: "user",
                        as: "reports",
                    },
                },

                {
                    $project: {
                        username: 1,
                        email: 1,
                        isAcceptTermsConditions: 1,
                        isVerified: 1,
                        createdAt: 1,

                        reportsCount: {
                            $size: "$reports",
                        },
                    },
                },

                {
                    $sort: sort,
                },

                {
                    $skip: (page - 1) * limit,
                },

                {
                    $limit: limit,
                },
            ]),

            User.countDocuments(query),

            User.countDocuments({
                isVerified: true,
            }),

            User.countDocuments({
                isVerified: false,
            }),
        ]);

        return res.status(200).json({
            success: true,
            Users: {
                users,

                pagination: {
                    page,
                    limit,
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                },

                stats: {
                    totalUsers,
                    activeUsers: verifiedUsers,
                    verifiedUsers,
                    unverifiedUsers,
                },
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getReports = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            filter = "all",
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const query = {};
        let sort = { createdAt: -1 };

        // ==========================
        // SEARCH
        // ==========================
        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    jobDescription: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // ==========================
        // FILTERS
        // ==========================
        switch (filter) {
            case "high":
                query.matchScore = { $gte: 85 };
                break;

            case "medium":
                query.matchScore = {
                    $gte: 70,
                    $lt: 85,
                };
                break;

            case "low":
                query.matchScore = { $lt: 70 };
                break;

            case "today":
                query.createdAt = {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                };
                break;

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "newest":
            case "all":
            default:
                sort = { createdAt: -1 };
                break;
        }

        const [
            reports,
            totalReports,
            averageMatchScore,
            todayReports,
        ] = await Promise.all([
            interviewReportModel
                .find(query)
                .populate("user", "username email")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit),

            interviewReportModel.countDocuments(query),

            interviewReportModel.aggregate([
                {
                    $match: query,
                },
                {
                    $group: {
                        _id: null,
                        average: {
                            $avg: "$matchScore",
                        },
                    },
                },
            ]),

            interviewReportModel.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            }),
        ]);

        const formattedReports = reports.map((report) => ({
            _id: report._id,

            title: report.title,

            username: report.user?.username,

            email: report.user?.email,

            matchScore: report.matchScore,

            technicalQuestions:
                report.technicalQuestions.length,

            behaviouralQuestions:
                report.behaviouralQuestions.length,

            skillGaps:
                report.skillGaps.length,

            preparationDays:
                report.preparationPlan.length,

            createdAt: report.createdAt,
        }));

        return res.status(200).json({
            success: true,

            reports: {
                reports: formattedReports,

                pagination: {
                    page,
                    limit,
                    totalReports,
                    totalPages: Math.ceil(totalReports / limit),
                },

                stats: {
                    totalReports,

                    todayReports,

                    averageMatchScore:
                        averageMatchScore.length > 0
                            ? Number(averageMatchScore[0].average).toFixed(1)
                            : 0,
                },
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getSingleReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Report ID",
            });
        }

        const report = await interviewReportModel
            .findById(reportId)
            .populate("user", "username email isVerified createdAt");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Report ID",
            });
        }

        const report = await interviewReportModel.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        await report.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete all reports of this user
        await interviewReportModel.deleteMany({
            user: userId,
        });

        // Delete user
        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User and all associated reports deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 29);
        last30Days.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            totalReports,
            userGrowth,
            reportGrowth,
            matchScoreDistribution,
            skillGapDistribution,
            topJobTitles,
            averageMatchScore,
        ] = await Promise.all([

            // Total Users
            User.countDocuments(),

            // Total Reports
            interviewReportModel.countDocuments(),

            // User Growth (Last 30 Days)
            User.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: last30Days,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            day: {
                                $dateToString: {
                                    format: "%d-%m",
                                    date: "$createdAt",
                                },
                            },
                        },
                        users: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.day": 1,
                    },
                },
            ]),

            // Report Growth (Last 30 Days)
            interviewReportModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: last30Days,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            day: {
                                $dateToString: {
                                    format: "%d-%m",
                                    date: "$createdAt",
                                },
                            },
                        },
                        reports: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.day": 1,
                    },
                },
            ]),

            // Match Score Distribution
            interviewReportModel.aggregate([
                {
                    $bucket: {
                        groupBy: "$matchScore",
                        boundaries: [0, 70, 80, 90, 101],
                        output: {
                            total: {
                                $sum: 1,
                            },
                        },
                    },
                },
            ]),

            // Skill Gap Distribution
            interviewReportModel.aggregate([
                {
                    $unwind: "$skillGaps",
                },
                {
                    $group: {
                        _id: "$skillGaps.skill",
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        total: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]),

            // Top Job Titles
            interviewReportModel.aggregate([
                {
                    $group: {
                        _id: "$title",
                        total: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        total: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ]),

            // Average Match Score
            interviewReportModel.aggregate([
                {
                    $group: {
                        _id: null,
                        average: {
                            $avg: "$matchScore",
                        },
                    },
                },
            ]),
        ]);
        // ==========================
        // Last 30 Days Labels
        // ==========================

        const last30DaysData = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date();

            date.setDate(date.getDate() - i);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");

            last30DaysData.push({
                day: `${day}-${month}`,
                users: 0,
                reports: 0,
            });
        }

        // ==========================
        // Fill User Growth
        // ==========================

        userGrowth.forEach((item) => {
            const index = last30DaysData.findIndex(
                (d) => d.day === item._id.day
            );

            if (index !== -1) {
                last30DaysData[index].users = item.users;
            }
        });

        // ==========================
        // Fill Report Growth
        // ==========================

        reportGrowth.forEach((item) => {
            const index = last30DaysData.findIndex(
                (d) => d.day === item._id.day
            );

            if (index !== -1) {
                last30DaysData[index].reports = item.reports;
            }
        });

        // ==========================
        // Separate Arrays
        // ==========================

        const formattedUserGrowth = last30DaysData.map((item) => ({
            day: item.day,
            users: item.users,
        }));

        const formattedReportGrowth = last30DaysData.map((item) => ({
            day: item.day,
            reports: item.reports,
        }));
        // ==========================
        // STORAGE
        // ==========================

        const db = mongoose.connection.db;

        const stats = await db.command({
            collStats: interviewReportModel.collection.collectionName,
        });

        const storageUsed = (
            stats.storageSize / 1024 / 1024
        ).toFixed(2);

        // ==========================
        // AI REQUESTS
        // ==========================

        // Abhi har report = 1 AI Request

        const aiRequests = totalReports;

        // ==========================
        // SUCCESS RATE
        // ==========================

        const successRate =
            averageMatchScore.length > 0
                ? Number(
                    averageMatchScore[0].average
                ).toFixed(1)
                : 0;

        // ==========================
        // SYSTEM HEALTH
        // ==========================

        const systemHealth = {
            api: true,
            database: mongoose.connection.readyState === 1,
            server: process.uptime() > 0,

            uptime: Math.floor(process.uptime()),

            memory: Math.round(
                process.memoryUsage().heapUsed / 1024 / 1024
            ),
        };

        res.status(200).json({
            success: true,

            analytics: {
                cards: {
                    totalUsers,
                    totalReports,
                    aiRequests,
                    storageUsed,
                    averageMatchScore: successRate,
                },

                charts: {
                    userGrowth: formattedUserGrowth,
                    reportGrowth: formattedReportGrowth,
                },

                distributions: {
                    matchScoreDistribution,
                    skillGapDistribution,
                },

                topJobTitles,

                systemHealth,
            },
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getAIUsage = async (req, res) => {
    try {
        const [
            totalRequests,
            averageMatchScore,
            recentRequests,
        ] = await Promise.all([
            interviewReportModel.countDocuments(),

            interviewReportModel.aggregate([
                {
                    $group: {
                        _id: null,
                        average: {
                            $avg: "$matchScore",
                        },
                    },
                },
            ]),

            interviewReportModel
                .find()
                .populate("user", "username email")
                .sort({ createdAt: -1 })
                .limit(10),
        ]);

        // ==========================
        // STORAGE
        // ==========================

        const db = mongoose.connection.db;

        const stats = await db.command({
            collStats: interviewReportModel.collection.collectionName,
        });

        const storageUsed = (
            stats.storageSize /
            1024 /
            1024
        ).toFixed(2);

        // ==========================
        // SYSTEM HEALTH
        // ==========================

        const systemHealth = {
            api: true,
            database: mongoose.connection.readyState === 1,
            server: process.uptime() > 0,

            uptime: Math.floor(process.uptime()),

            memory: Math.round(
                process.memoryUsage().heapUsed /
                1024 /
                1024
            ),
        };

        res.status(200).json({
            success: true,

            aiUsage: {
                cards: {
                    totalRequests,
                    storageUsed,

                    averageMatchScore:
                        averageMatchScore.length > 0
                            ? Number(
                                averageMatchScore[0].average
                            ).toFixed(1)
                            : 0,
                },

                usage: {
                    interviewReports: totalRequests,
                    resumeAnalysis: 0,
                    chatRequests: 0,
                },

                systemHealth,

                recentRequests,
            },
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getSettings = async (req, res) => {
    try {
        // ==========================
        // STORAGE
        // ==========================

        const db = mongoose.connection.db;

        const stats = await db.command({
            collStats: interviewReportModel.collection.collectionName,
        });

        const storageUsed = Number(
            (stats.storageSize / 1024 / 1024).toFixed(2),
        );

        const storageLimit = 512; // Free MongoDB

        const storagePercentage = Number(
            ((storageUsed / storageLimit) * 100).toFixed(1),
        );

        // ==========================
        // SYSTEM HEALTH
        // ==========================

        const systemHealth = {
            database: mongoose.connection.readyState === 1,
            gemini: !!process.env.GOOGLE_GENAI_API_KEY,
            authentication:
                !!process.env.ADMIN_EMAIL &&
                !!process.env.ADMIN_PASSWORD,
        };

        // ==========================
        // RESPONSE
        // ==========================

        return res.status(200).json({
            success: true,

            settings: {
                profile: {
                    name: process.env.ADMIN_NAME || "Admin",
                    email: process.env.ADMIN_EMAIL,
                },

                gemini: {
                    configured: !!process.env.GOOGLE_GENAI_API_KEY,
                    key: process.env.GOOGLE_GENAI_API_KEY
                        ? "••••••••••••••••••••••••••••"
                        : "Not Configured",
                },

                appearance: {
                    theme: "Dark",
                },

                notifications: {
                    emailNotifications: true,
                    systemAlerts: true,
                },

                storage: {
                    used: storageUsed,
                    total: storageLimit,
                    percentage: storagePercentage,
                },

                systemHealth,
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

