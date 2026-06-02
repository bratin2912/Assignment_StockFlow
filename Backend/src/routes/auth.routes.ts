import { Router } from 'express';
import * as authService from '../services/auth.service';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { organizationId, email, password } = req.body;
    const result = await authService.signup(organizationId, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

export default router;