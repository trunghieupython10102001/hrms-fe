import { IContact, IContactHistoryAPIResponse } from '@/interface/business';

export function mapAPIResponseToContactHistories(data: IContactHistoryAPIResponse): IContact {
  return {
    businessID: data.BusinessID,
    content: data.Content,
    logID: data.LogID,
    note: data.Note,
    createTime: data.CreateTime,
    createUser: data.CreateUser,
    updateTime: data.UpdateTime,
    updateUser: data.UpdateUser,
  };
}
