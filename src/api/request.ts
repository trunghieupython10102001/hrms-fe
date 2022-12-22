import { CUSTOM_EVENTS } from '@/constants/keys';
import { TIME_THRESHOR } from '@/constants/time';
import { history } from '@/routes/history';
import dispatchCustomEvent from '@/utils/dispatchCustomEvent';
import axios, { AxiosRequestConfig, Method } from 'axios';

const axiosInstance = axios.create({
  timeout: 6000,
});

const BASE_URL = 'http://localhost:3030/api/v1';
let interactionTimeStamp = 0;

axiosInstance.interceptors.request.use(
  config => {
    config.baseURL = BASE_URL;
    const accessToken = localStorage.getItem('accessToken') || '';

    console.log('Axios config: ', config);

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const currentTimestamp = Date.now();

    if (!interactionTimeStamp || currentTimestamp - interactionTimeStamp <= TIME_THRESHOR) {
      interactionTimeStamp = currentTimestamp;
      dispatchCustomEvent(CUSTOM_EVENTS.UPDATE_INTERACTION_TIME);
    } else if (config.url !== '/auth/signin') {
      history.replace('/login');
      interactionTimeStamp = 0;
      dispatchCustomEvent(CUSTOM_EVENTS.SESSION_EXPIRE);

      return Promise.reject(new Error('Session expire'));
    }

    return config;
  },
  // error => {
  //   Promise.reject(error);
  // },
);

axiosInstance.interceptors.response.use(undefined, async error => {
  if (error.response.status === 401 && error.response.data.message === 'Unauthorized') {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const result = await axiosInstance.post(`${BASE_URL}/auth/refreshToken`, {
        refreshToken,
      });

      const loginTokens = result.data;

      localStorage.setItem('accessToken', loginTokens.accessToken);
      localStorage.setItem('refreshToken', loginTokens.refreshToken);

      error.config.headers['Authorization'] = `Bearer ${loginTokens.token}`;
      const newRequest = await axiosInstance.request(error.config);

      return newRequest;
    } catch (error) {
      history.replace('/login');
      interactionTimeStamp = 0;
      dispatchCustomEvent(CUSTOM_EVENTS.SESSION_EXPIRE);
    }

    return Promise.reject(error.response);
  }

  return Promise.reject(error);
});

export type Response<T = any> = {
  status: boolean;
  message: string;
  data: T;
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
