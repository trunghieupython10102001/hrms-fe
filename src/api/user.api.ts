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

export const changeUserPassword = (form: any) => request('patch', '/auth/updatePassword', form);

export const getRefreshToken = (refreshToken: string) => request('post', '/auth/refreshToken', { refreshToken });

export const editUser = async (uid: number, form: any) => {
  try {
    const response: any = await request('put', `/auth/${uid}`, form);

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const getUserDetail = async (id: string | number) => {
  try {
    const response: any = await request('get', `/auth/${id}`);

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const getAllUser = async (params?: object) => {
  try {
    const response: any = await request('get', '/auth/getAll', params);

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

export const getUserRole = async () => {
  try {
    const response: any = await request('get', '/auth/getMe');

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const deleteUser = async (uid: number) => {
  try {
    const response = await request('delete', `/auth/${uid}`);

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const editUserRole = async (role: {
  functionId: number;
  userId: number;
  isDelete: boolean;
  isGrant: boolean;
  isInsert: boolean;
  isUpdate: boolean;
}) => {
  try {
    const response = await request('post', '/user-function/', role);

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const uploadUserAvatar = async (form: FormData) => request('post', '/auth/avatar', form);
