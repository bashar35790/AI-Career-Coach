import { Router } from 'express';
import authRoutes from './auth.routes';
import itemsRoutes from './items.routes';
import usersRoutes from './users.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/users', usersRoutes);
router.use('/ai', aiRoutes);

export default router;
