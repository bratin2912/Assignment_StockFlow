import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';

export const signup = async (
  organizationId: string,
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

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      organizationId: organization.id,
    },
  });

  const token = generateToken(
    user.id,
    organization.id,
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
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