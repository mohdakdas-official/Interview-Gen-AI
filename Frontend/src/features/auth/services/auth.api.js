import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

export const register = async ({ username, email, password, isAcceptTermsConditions }) => {
    try {
        const response = await api.post('/api/auth/register', { username, email, password, isAcceptTermsConditions })

        return response.data
    } catch (error) {
        throw error;

    }
}

export const verifyOtp = async ({ username, email, password, isAcceptTermsConditions, otp }) => {
    try {
        const response = await api.post('/api/auth/verify-otp', { username, email, password, isAcceptTermsConditions, otp })

        return response.data
    } catch (error) {
        throw error;
    }
}

export const login = async ({ email, password }) => {
    try {
        const response = await api.post("/api/auth/login", {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (error) {
        throw error;

    }
}

export const getMe = async () => {
    try {
        const response = await api.get("/api/auth/get-me")

        return response.data
    } catch (error) {
        throw error;

    }
}