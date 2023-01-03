export interface BuniesssUser {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

export const EEnterpriseType = ['N/A', 'Công ty xuất khẩu', 'Công ty nhập khẩu'];
export const EEnterpriseStatus = ['unactive', 'active'];
export type TEnterpriseType = 1 | 2;

export interface IEnterpriseAPIResponse {
  BusinessID?: number;
  BusinessName?: string;
  BusinessType?: TEnterpriseType;
  BusinessAreaID?: number;
  BusinessAreaName?: string;
  BusinessAddress?: string;
  BusinessEmail?: string;
  BusinessPhone?: string;
  Country?: string;
  ContactDetail?: string;
  ContactedTimes?: number;
  Note?: string;
  Status?: 1 | 0;
  ImageLink?: string;
  CreateTime?: string;
  CreateUser?: string;
  UpdateTime?: string;
  UpdateUser?: string;
}

export interface IEnterprise {
  id: number;
  name: string;
  type: TEnterpriseType;
  areaID: number;
  areaName: string;
  address: string;
  email: string;
  phone: string;
  country: string;
  contactDetail: string;
  contactedTimes: number;
  note: string;
  status: 0 | 1;
  createTime: string;
  createUser?: string;
  updateTime: string;
  image: string;
  updateUser?: string;
}

export interface IContact {
  logID: number;
  businessID: number;
  content: string;
  note: string;
  createTime?: string;
  createUser?: string;
  updateTime?: string;
  updateUser?: string;
}

export interface IContactHistoryAPIResponse {
  LogID: number;
  BusinessID: number;
  Content: string;
  Note: string;
  CreateTime: string;
  CreateUser: string;
  UpdateTime: string;
  UpdateUser: string;
}

export interface IEnterpriseProductAPIResponse {
  BusinessDetailID: number;
  BusinessID: number;
  BusinessName: string;
  BusinessType: TEnterpriseType;
  ImportProductDetail: string;
  ExportProductDetail: string;
  UnitPrice: string;
  Status: -1 | 0 | 1;
  CreateTime: string;
  CreateUser: string;
  UpdateTime: string;
  UpdateUser: string;
}

export interface IEnterpriseProduct {
  productID: number;
  enterpriseID: number;
  enterpriseName: string;
  enterpriseType: string;
  detailInfo: string;
  price: string;
  createAt: string;
  createBy: string;
}

export interface IEnterpriseFilterForm {
  enterpriseName?: string;
  enterpriseEmail?: string;
  enterprisePhone?: string;
  enterpriseType?: number;
  enterpriseArea?: number;
}
