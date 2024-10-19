import { create } from 'zustand';
import { mockApi } from '@/api/mockapi';

interface PaginationState {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const usePagination = create<PaginationState>((set) => ({
  page: 1,
  limit: 10,
  setPage: (page: number) => set({ page }),
  setLimit: (limit: number) => set({ limit }),
}));

export interface Address {
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  stateAbbr: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id?: string;
  fullName: string;
  email: string;
  company: string;
  address: Address;
  phone: string;
  application?: string;
  version?: string;
  options?: string;
  serialNumber?: string;
}

export const fetchCustomers = async (page: number, limit: number) => {
  const response = await mockApi.get('/customers', {
    params: { page, limit },
  });
  return response.data;
};

export const fetchCustomerById = async (id: number) => {
  const response = await mockApi.get(`/customers/${id}`);
  return response.data;
};

export const fetchCustomerBySN = async (serialNumber: string) => {
  const response = await mockApi.get('/customers', {
    params: {
      serialNumber,
    },
  });
  return response.data;
};

export const createCustomer = async (customer: Customer) => {
  const response = await mockApi.post('/customers', customer);
  return response.data;
};

export const updateCustomer = async (
  customerId: number,
  customer: Customer
) => {
  const response = await mockApi.put(`/customers${customerId}`, customer);
  return response.data;
};
