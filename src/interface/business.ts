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

export interface IEnterpriseAPIResponse {
  BusinessID?: number;
  BusinessName?: string;
  BusinessType?: 1 | 2;
  BusinessAreaID?: number;
  BusinessAddress?: string;
  BusinessEmail?: string;
  BusinessPhone?: string;
  Country?: string;
  ContactDetail?: string;
  ContactedTimes?: number;
  Note?: string;
  Status?: 1 | 0;
  CreateTime?: string;
  CreateUser?: string;
  UpdateTime?: string;
  UpdateUser?: string;
}

export interface IEnterprise {
  id: number;
  name: string;
  type: 1 | 2;
  areaID: number;
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
