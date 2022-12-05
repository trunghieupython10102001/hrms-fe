import { IEnterprise, IEnterpriseAPIResponse } from '@/interface/business';

export function mapEnterpriseAPIResponseToEnterprise(data: IEnterpriseAPIResponse): IEnterprise {
  return {
    id: data.BusinessID as number,
    name: data.BusinessName as string,
    type: data.BusinessType as 1 | 2,
    areaID: data.BusinessAreaID as number,
    address: data.BusinessAddress as string,
    email: data.BusinessEmail as string,
    phone: data.BusinessPhone as string,
    country: data.Country as string,
    contactDetail: data.ContactDetail as string,
    contactedTimes: data.ContactedTimes as number,
    note: data.Note as string,
    status: data.Status as 0 | 1,
    createTime: data.CreateTime as string,
    createUser: data.CreateUser as string,
    updateTime: data.UpdateTime as string,
    updateUser: data.UpdateUser as string,
  };
}

export function mapEnterpriseInfoToAPIRequest(data: IEnterprise) {
  return {
    businessId: data.id || 0,
    businessName: data.name,
    businessType: data.type,
    businessAreaId: data.areaID,
    businessAddress: data.address,
    businessEmail: data.email,
    businessPhone: data.phone,
    country: data.country,
    contactDetail: data.contactDetail,
    note: data.note,
    status: data.status as 1 | 0,
  };
}
