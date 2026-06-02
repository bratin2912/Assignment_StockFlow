import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (
  userId: string,
  organizationId: string,
) => {
  return jwt.sign(
    {
      userId,
      organizationId,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
};