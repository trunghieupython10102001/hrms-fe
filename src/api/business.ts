import { request } from './request';

// export const getBusinessUserList = (params: any) => request<PageData<BuniesssUser>>('get', '/business', params);

export const getEnterprises = (params?: object) => request('get', '/business', params);
export const getBusinessAreasList = (params?: any) => request('get', '/business-area', params);
export const createOrUpdateBussinessArea = (data: any) => request('post', '/business-area', data);

export const getDetailEnterprise = (id: string) =>
  request('get', '/business/', {
    businessId: id,
  });
export const getContactList = (params?: object) => request('get', '/contact-log', params);
export const getProductsList = (params?: object) => request('get', '/business-detail', params);

export const createEnterprise = async (form: object) => {
  return request('post', '/business', form);
};

export const createContactHistory = async (form: object) => {
  return request('post', '/contact-log', form);
};

export const createProduct = async (form: object) => {
  return request<{ code: number; message: string }>('post', '/business-detail', form);
};

export const getBussinessTemplateFile = async () => {
  return request<string>('get', '/business/template');
};

export const exportEnterpriseDataToExcel = async (ids: string) => {
  return request<string>('get', '/business/excel', { ids });
};
