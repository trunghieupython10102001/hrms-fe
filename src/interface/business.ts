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
