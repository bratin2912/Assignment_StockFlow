import prisma from '../config/prisma';

interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export const createProduct = async (
  organizationId: string,
  data: CreateProductInput,
) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      organizationId,
      sku: data.sku,
    },
  });

  if (existingProduct) {
    throw new Error('SKU already exists');
  }

  return prisma.product.create({
    data: {
      organizationId,
      ...data,
    },
  });
};

export const getProducts = async (
  organizationId: string,
  search?: string,
) => {
  return prisma.product.findMany({
    where: {
      organizationId,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            sku: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getProductById = async (
  id: string,
  organizationId: string,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const updateProduct = async (
  id: string,
  organizationId: string,
  data: UpdateProductInput,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (data.sku) {
    const existingSku = await prisma.product.findFirst({
      where: {
        organizationId,
        sku: data.sku,
        NOT: {
          id,
        },
      },
    });

    if (existingSku) {
      throw new Error('SKU already exists');
    }
  }

  return prisma.product.update({
    where: {
      id,
      organizationId,
    },
    data,
  });
};

export const deleteProduct = async (
  id: string,
  organizationId: string,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({
    where: {
      id,
      organizationId,
    },
  });

  return {
    message: 'Product deleted successfully',
  };
};

export const adjustStock = async (
  id: string,
  organizationId: string,
  adjustment: number,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const updatedQuantity = product.quantityOnHand + adjustment;

  if (updatedQuantity < 0) {
    throw new Error('Insufficient stock for adjustment');
  }

  return prisma.product.update({
    where: {
      id,
      organizationId,
    },
    data: {
      quantityOnHand: updatedQuantity,
    },
  });
};
