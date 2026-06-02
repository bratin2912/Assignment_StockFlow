import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as settingsService from '../services/settings.service';
import { updateSettingsSchema } from '../schemas/settings.schema';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const settings = await settingsService.getSettings(user.organizationId);
    res.json(settings);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.put('/', validate(updateSettingsSchema), async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const settings = await settingsService.updateSettings(user.organizationId, req.body);
    res.json(settings);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

export default router;