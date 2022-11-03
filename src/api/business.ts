import { request } from './request';
import { PageData } from '@/interface';
import { BuniesssUser, IEnterprise } from '@/interface/business';
import { sleep } from '@/utils/misc';

export const getBusinessUserList = (params: any) => request<PageData<BuniesssUser>>('get', '/business/list', params);

export const createEnterprise = async (form: IEnterprise) => {
  await sleep(1500);

  return form;
  //  request('get', '/');
};
