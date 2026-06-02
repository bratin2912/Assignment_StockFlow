import axios from './axios';

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export const getProducts = async (search?: string) => {
  const params = search ? { search } : {};
  return axios.get('/products', { params });
};

export const getProductById = async (id: string) => {
  return axios.get(`/products/${id}`);
};

export const createProduct = async (data: CreateProductInput) => {
  return axios.post('/products', data);
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const processedData = {
    ...data,
    quantityOnHand: data.quantityOnHand !== undefined ? Number(data.quantityOnHand) : undefined,
    costPrice: data.costPrice !== undefined ? Number(data.costPrice) : undefined,
    sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : undefined,
    lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : undefined,
  };
  return axios.put(`/products/${id}`, processedData);
};

export const deleteProduct = async (id: string) => {
  return axios.delete(`/products/${id}`);
};

export const getLowStockProducts = async () => {
  return axios.get('/products/low-stock');
};

export const getDashboardStats = async () => {
  return axios.get('/products/stats/dashboard');
};

export const adjustStock = async (id: string, adjustment: number) => {
  return axios.post(`/products/${id}/adjust-stock`, { adjustment });
};