import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/settings', settingsRoutes);

export default router;
