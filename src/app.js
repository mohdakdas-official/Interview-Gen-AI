import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5473',
    credentials: true
}))

app.use('/api/auth', authRouter);

module.exports = app;