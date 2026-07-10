import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, verifyOtp, logout, getMe, forgotPassword, verifyForgotEmail, resetPassword } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, authimg } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            setUser(data.user);

            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({
        username,
        email,
        password,
        isAcceptTermsConditions
    }) => {
        setLoading(true);

        try {
            const data = await register({
                username,
                email,
                password,
                isAcceptTermsConditions
            });

            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async ({ username, email, password, isAcceptTermsConditions, otp }) => {
        setLoading(true);

        try {
            const data = await verifyOtp({
                username,
                email,
                password,
                isAcceptTermsConditions,
                otp,
            });

            setUser(data.user);

            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async ({ email }) => {
        setLoading(true);

        try {
            const data = await forgotPassword({ email });

            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyForgotEmail = async ({ email, otp }) => {
        setLoading(true);

        try {
            const data = await verifyForgotEmail({
                email,
                otp,
            });

            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await resetPassword({
                email,
                password,
            });

            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();

                if (data?.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);


    return {
        user, loading, handleRegister, handleVerifyOtp, handleLogin, handleLogout, authimg, handleForgotPassword,
        handleVerifyForgotEmail,
        handleResetPassword
    }
}