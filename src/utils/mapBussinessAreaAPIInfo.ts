import { IBusinessArea, IBusinessAreaAPIResponse } from '@/interface/businessArea';

export function mapAPIResponseToBussinessArea(data: IBusinessAreaAPIResponse): IBusinessArea {
  return {
    createTime: data.CreateTime,
    id: data.BusinessAreaID,
    name: data.BusinessAreaName,
    updateTime: data.UpdateTime,
  };
}

export function mapBussinessAreaToAPIRequest(data: IBusinessArea) {
  return { businessAreaId: data.id || 0, businessAreaName: data.name, status: 1 };
}
