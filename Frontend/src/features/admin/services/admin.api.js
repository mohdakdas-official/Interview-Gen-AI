import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/admin",
    withCredentials: true,
});

/* ===========================
   AUTH
=========================== */

export const adminLogin = (data) => api.post("/login", data);

export const adminVerify = () => api.get("/me");

export const adminLogout = () => api.post("/logout");

/* ===========================
   DASHBOARD
=========================== */

export const getDashboard = () => api.get("/dashboard");

/* ===========================
   USERS
=========================== */

export const getUsers = ({
    page = 1,
    limit = 10,
    search = "",
} = {}) =>
    api.get("/users", {
        params: {
            page,
            limit,
            search,
        },
    });

export const getUser = (userId) =>
    api.get(`/users/${userId}`);

export const deleteUser = (userId) =>
    api.delete(`/users/${userId}`);

export const blockUser = (userId) =>
    api.patch(`/users/${userId}/block`);

export const unblockUser = (userId) =>
    api.patch(`/users/${userId}/unblock`);

/* ===========================
   REPORTS
=========================== */

export const getReports = ({
    page = 1,
    limit = 10,
    search = "",
    minScore = 0,
    maxScore = 100,
} = {}) =>
    api.get("/reports", {
        params: {
            page,
            limit,
            search,
            minScore,
            maxScore,
        },
    });

export const getReport = (reportId) =>
    api.get(`/reports/${reportId}`);

export const deleteReport = (reportId) =>
    api.delete(`/reports/${reportId}`);

export const downloadReport = (reportId) =>
    api.get(`/reports/${reportId}/pdf`, {
        responseType: "blob",
    });

/* ===========================
   ANALYTICS
=========================== */

export const getAnalytics = () =>
    api.get("/analytics");

/* ===========================
   AI USAGE
=========================== */

export const getAIUsage = () =>
    api.get("/ai-usage");

/* ===========================
   SUBSCRIPTIONS
=========================== */

// export const getSubscriptions = () =>
//     api.get("/subscriptions");

/* ===========================
   SETTINGS
=========================== */

export const getSettings = () =>
    api.get("/settings");

export const updateSettings = (data) =>
    api.patch("/settings", data);

export default api;