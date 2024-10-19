import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Customer } from '@/api/queries/customers';

export const generateSN = async (customer: Customer) => {
  const formData = createFormData(customer);
  const response = await axios.post(
    'https://www.unpromptu.com/api/api.php',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const batchGenerate = async (customer: Customer, count: number) => {
  const serialNumbers: string[] = [];
  for (let i = 0; i < count; i++) {
    try {
      customer.options = `${i}`;
      const response = await generateSN(customer);
      serialNumbers.push(response);
    } catch (error) {
      console.error(`error generating serial number ${i + 1}:`, error);
    }
  }
  return serialNumbers;
};

export const createFormData = (customer: Customer) => {
  const data = {
    Key: 'nV3lY5kI2jW5vK1cC8sH9mJ9jV5jU9fH',
    Action: 'Generate',
    Name: customer.fullName,
    Email: customer.email,
    Address: customer.address.streetAddress,
    Cell: customer.phone.replace(/\D/g, ''),
    App: customer.application,
    Version: customer.version,
    Options: customer.options,
  };
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('CRC', generateCrc(data));
  return formData;
};

export const generateCrc = (params: Record<string, string>): string => {
  const concatenatedParams = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  const result = concatenatedParams + 'tQ3fY0aR0wV5nC3uL6iO9gV1tX5lM1rX';
  return CryptoJS.MD5(result).toString(CryptoJS.enc.Hex).toUpperCase();
};
