import { request } from './request';
import { LoginResult, LoginParams } from '../interface/user/login';
import { IUser } from '@/interface/user/user';
import { sleep } from '@/utils/misc';

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
  await sleep(1500);

  return {
    id,
    avatarUrl:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACjSURBVHgBfdE/CsIwFAbw773oIiiCY8W50NkTuNpBj+Hq6hW8ih7DE4h/Zh0dbKFd2qRNAy2lSb4p5PuRhDyBYL/ELBwjfeawhMHFAVyeGmgFRDcoTGp4tCGB/+uNeUg1isByjWl0R/pIOqDjQaI9y4FE70IL4uG7perWKu+DVbyFpBiEDHJ0xvf6I3d5+eht8pUGeErzk4o2rtIk2C1cc9CpAIyzU3iT3pj3AAAAAElFTkSuQmCC',
    dateOfBirth: '01/24/2001',
    email: 'andja@dfkaa.add',
    fullname: 'Ngo Viet Hoang',
    phoneNumber: '0123456789',
    createdAt: '10/29/2022',
    upDatedAt: '10/29/2022',
    username: 'hoangzzzsss',
    createdBy: 1,
    password: '123',
  };
  // return request('get', `/user/${id}`);
};
export const getAllUser = async () => {
  try {
    const response: any = await request('get', '/auth/getAll');

    return [response.data, undefined];
  } catch (error) {
    return [undefined, error];
  }
};
