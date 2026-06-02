import { makeAutoObservable, action } from 'mobx';
import * as productApi from '../api/product.api';

class ProductStore {
  products: productApi.Product[] = [];
  lowStockProducts: productApi.Product[] = [];
  dashboardStats: {
    totalProducts: number;
    totalInventory: number;
    lowStockCount: number;
  } | null = null;
  isLoadingProducts = false;
  isLoadingLowStock = false;
  isLoadingDashboardStats = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProducts(search?: string) {
    this.isLoadingProducts = true;
    try {
      const res = await productApi.getProducts(search);
      action(() => {
        this.products = res.data;
      })();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.isLoadingProducts = false;
    }
  }

  async fetchLowStock() {
    this.isLoadingLowStock = true;
    try {
      const res = await productApi.getLowStockProducts();
      action(() => {
        this.lowStockProducts = res.data;
      })();
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      this.isLoadingLowStock = false;
    }
  }

  async fetchDashboardStats() {
    this.isLoadingDashboardStats = true;
    try {
      const res = await productApi.getDashboardStats();
      action(() => {
        this.dashboardStats = res.data;
      })();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      this.isLoadingDashboardStats = false;
    }
  }

  async createProduct(data: productApi.CreateProductInput) {
    try {
      const res = await productApi.createProduct(data);
      return res.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, data: productApi.UpdateProductInput) {
    const processedData = {
      ...data,
      quantityOnHand: data.quantityOnHand !== undefined ? Number(data.quantityOnHand) : undefined,
      costPrice: data.costPrice !== undefined ? Number(data.costPrice) : undefined,
      sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : undefined,
      lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : undefined,
    };

    const res = await productApi.updateProduct(id, processedData);
    action(() => {
      const index = this.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.products[index] = res.data;
      }
    })();
    return res.data;
  }

  async deleteProduct(id: string) {
    await productApi.deleteProduct(id);
    action(() => {
      this.products = this.products.filter(p => p.id !== id);
    })();
  }

  async adjustStock(id: string, adjustment: number) {
    const res = await productApi.adjustStock(id, adjustment);
    action(() => {
      const index = this.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.products[index] = res.data;
      }
    })();
    return res.data;
  }
}

export const productStore = new ProductStore();
