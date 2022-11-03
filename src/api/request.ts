import { history } from '@/routes/history';
import { notification } from 'antd';
import axios, { AxiosRequestConfig, Method } from 'axios';
// import { history } from '@/routes/history';

const axiosInstance = axios.create({
  timeout: 6000,
});

const BASE_URL = 'http://localhost:3030/api/v1';

axiosInstance.interceptors.request.use(
  config => {
    config.baseURL = BASE_URL;
    const accessToken = localStorage.getItem('accessToken') || '';

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  // error => {
  //   Promise.reject(error);
  // },
);

axiosInstance.interceptors.response.use(undefined, error => {
  if (error.response.status === 401 && error.response.data.message === 'Unauthorized') {
    history.replace('/login');
    notification.error({
      message: 'Phiên đăng nhập hết hạn',
      description: 'Bạn vui lòng đăng nhập lại để tiếp tục',
    });

    return Promise.reject(error.response);
  }

  return Promise.reject(error);
});

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = '';

  url = prefix + url;
  if (method === 'post') {
    return axiosInstance.post(url, data, config);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...config,
    });
  }
};
