import axios from "axios";

import {accessTokenStorage, userStorage} from './storage';

export const fetcher = axios.create({
  baseURL: "/api",
})
axios.interceptors.request.use(request => {
  return request;
});

fetcher.interceptors.request.use((config) => {
  if (accessTokenStorage.get() && !config.url.includes('refresh') && !config.url.includes('login')) {
    config.headers.Authorization = `Bearer ${accessTokenStorage.get()}`
  }

  return config;
})
fetcher.interceptors.response.use((response) => response, (error) => {
  if (error?.response?.status === 401 && !error?.config?.url.includes('refresh') && !error?.config?.url.includes('login')) {
    accessTokenStorage.clear()
    userStorage.clear()
    if (typeof window !== 'undefined') {
      window.location.href = "/"
    }
  }
  return Promise.reject(error);
})
