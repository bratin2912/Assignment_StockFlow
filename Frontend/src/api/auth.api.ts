import axios from './axios';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
}

export const login = async (data: LoginInput) => {
  return axios.post('/auth/login', data);
};

export const signup = async (data: SignupInput) => {
  return axios.post('/auth/signup', data);
};

export const getOrganizations = async () => {
  return axios.get<Organization[]>('/organizations');
};
