import axios from './axios';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  organizationName: string;
}

export const login = async (data: LoginInput) => {
  return axios.post('/auth/login', data);
};

export const signup = async (data: SignupInput) => {
  return axios.post('/auth/signup', data);
};