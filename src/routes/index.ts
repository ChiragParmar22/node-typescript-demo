import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

export const mainRouter = express.Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/user', userRoutes);
