import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';

export const signup = async (
  organizationName: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10,
  );

  const result = await prisma.$transaction(
    async (tx) => {
      const organization =
        await tx.organization.create({
          data: {
            name: organizationName,
          },
        });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          organizationId: organization.id,
        },
      });

      return {
        user,
        organization,
      };
    },
  );

  const token = generateToken(
    result.user.id,
    result.organization.id,
  );

  return {
    token,
    user: {
      id: result.user.id,
      email: result.user.email,
    },
  };
};

export const login = async (
  email: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(
    user.id,
    user.organizationId,
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};