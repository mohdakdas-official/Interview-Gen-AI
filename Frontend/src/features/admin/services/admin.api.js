import axios from "axios";
import { baseUrl } from "../../baseURI/baseUrl";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

/* ===========================
   AUTH
=========================== */

export const adminLogin = (data) => api.post("/api/admin/login", data);

export const adminVerify = () => api.get("/api/admin/me");

export const adminLogout = () => api.post("/api/admin/logout");

/* ===========================
   DASHBOARD
=========================== */

export const getDashboard = () => api.get("/api/admin/dashboard");

/* ===========================
   USERS
=========================== */

export const getUsers = ({ page, limit, search, filter }) => {
    return api.get("/api/admin/users", {
        params: {
            page,
            limit,
            search,
            filter,
        },
    });
};

export const getUser = (userId) =>
    api.get(`/api/admin/users/${userId}`);

export const deleteUser = (userId) =>
    api.delete(`/api/admin/users/${userId}`);

export const blockUser = (userId) =>
    api.patch(`/api/admin/users/${userId}/block`);

export const unblockUser = (userId) =>
    api.patch(`/api/admin/users/${userId}/unblock`);

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
    api.get("/api/admin/reports", {
        params: {
            page,
            limit,
            search,
            minScore,
            maxScore,
        },
    });

export const getReport = (reportId) =>
    api.get(`/api/admin/reports/${reportId}`);

export const deleteReport = (reportId) =>
    api.delete(`/reports/${reportId}`);

export const downloadReport = (reportId) =>
    api.get(`/api/admin/reports/${reportId}/pdf`, {
        responseType: "blob",
    });

/* ===========================
   ANALYTICS
=========================== */

export const getAnalytics = () =>
    api.get("/api/admin/analytics");

/* ===========================
   AI USAGE
=========================== */

export const getAIUsage = () =>
    api.get("/api/admin/ai-usage");

/* ===========================
   SUBSCRIPTIONS
=========================== */

// export const getSubscriptions = () =>
//     api.get("/subscriptions");

/* ===========================
   SETTINGS
=========================== */

export const getSettings = () =>
    api.get("/api/admin/settings");

export const updateSettings = (data) =>
    api.patch("/api/admin/settings", data);

export default api;