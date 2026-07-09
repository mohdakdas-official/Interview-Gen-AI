import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey =
    process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOtpEmail = async (email, otp) => {
    try {
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: process.env.BREVO_SENDER_NAME,
            },

            to: [
                {
                    email,
                },
            ],

            subject: "Verify your Email",

            htmlContent: `
        <div style="font-family:Arial;padding:20px">
            <h2>Email Verification</h2>

            <p>Your OTP is:</p>

            <h1 style="letter-spacing:4px">${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>

            <br/>

            <p>If you didn't request this, ignore this email.</p>

        </div>
      `,
        });

    } catch (error) {
        console.log("========== ERROR ==========");
        console.dir(error, { depth: null });

        if (error.response) {
            console.log("Response:");
            console.dir(error.response.body, { depth: null });
        }
    }
};