import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import skillsRouter from './routes/skills.routes.js';
import cors from 'cors';
import authMiddleware from './middleware/auth-middleware.js';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MentorMatch API' });
});

app.use('/api/auth', authRouter);
app.use(authMiddleware);
app.use('/api/user', userRouter);
app.use('/api/skills', skillsRouter);



app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

