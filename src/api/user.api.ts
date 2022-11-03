import { request } from './request';
import { LoginResult, LoginParams } from '../interface/user/login';
import { IUser } from '@/interface/user/user';

export const apiLogin = async (data: LoginParams) => {
  try {
    const response = await request<LoginResult>('post', '/auth/signin', data);

    return [response, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const createNewUser = (form: IUser) => request('post', '/auth/signup', form);

export const getUserDetail = async (id: string | number) => {
  try {
    const response: any = await request('get', `/auth/${id}`);

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const getAllUser = async () => {
  try {
    const response: any = await request('get', '/auth/getAll');

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const getAllRoles = async () => {
  try {
    const response: any = await request('get', '/function');

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};
