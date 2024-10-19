import axios from 'axios';

export const mockApi = axios.create({
  baseURL: import.meta.env.VITE_MOCKAPI_BASE_URL,
});
