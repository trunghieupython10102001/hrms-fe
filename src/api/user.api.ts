import { request } from './request';
import { LoginResult, LoginParams, LogoutParams, LogoutResult } from '../interface/user/login';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiLogin = (data: LoginParams) => {
  console.log('Login data: ', data);

  return new Promise<{ result: LoginResult }>(res => {
    setTimeout(() => res({ result: { username: 'Hoangzzzsss', token: '123', role: 'admin' } }), 1500);
  });
  //   request<LoginResult>('post', '/user/login', data);
};

export const apiLogout = (data: LogoutParams) => request<LogoutResult>('post', '/user/logout', data);
