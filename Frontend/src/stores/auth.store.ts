import { makeAutoObservable } from 'mobx';

class AuthStore {
  token = localStorage.getItem('token');

  constructor() {
    makeAutoObservable(this);
  }

  login(token: string) {
    this.token = token;

    localStorage.setItem('token', token);
  }

  logout() {
    this.token = null;

    localStorage.removeItem('token');
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

export const authStore = new AuthStore();