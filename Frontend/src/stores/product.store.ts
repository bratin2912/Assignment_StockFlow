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

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProducts(search?: string) {
    const res = await productApi.getProducts(search);
    action(() => {
      this.products = res.data;
    })();
  }

  async fetchLowStock() {
    const res = await productApi.getLowStockProducts();
    action(() => {
      this.lowStockProducts = res.data;
    })();
  }

  async fetchDashboardStats() {
    const res = await productApi.getDashboardStats();
    action(() => {
      this.dashboardStats = res.data;
    })();
  }

  async createProduct(data: productApi.CreateProductInput) {
    const res = await productApi.createProduct(data);
    action(() => {
      this.products.unshift(res.data);
    })();
    return res.data;
  }

  async updateProduct(id: string, data: productApi.UpdateProductInput) {
    const res = await productApi.updateProduct(id, data);
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
