import { Router } from 'express';
import prisma from '../config/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

export default router;