import prisma from '../config/prisma';

interface UpdateSettingsInput {
  defaultLowStockThreshold?: number;
}

export const getSettings = async (organizationId: string) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      defaultLowStockThreshold: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  return organization;
};

export const updateSettings = async (
  organizationId: string,
  data: UpdateSettingsInput,
) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  return prisma.organization.update({
    where: {
      id: organizationId,
    },
    data,
  });
};