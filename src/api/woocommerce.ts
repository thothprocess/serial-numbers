import axios from 'axios';

export const woocommerceApi = axios.create({
  baseURL: import.meta.env.VITE_WOOCOMMERCE_BASE_URL,
  auth: {
    username: import.meta.env.VITE_WOOCOMMERCE_API_KEY,
    password: import.meta.env.VITE_WOOCOMMERCE_API_SECRET,
  },
});
