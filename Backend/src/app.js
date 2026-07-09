import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import interviewRouter from './routes/interview.routes.js';
import adminRoutes from "../src/routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

export default app;