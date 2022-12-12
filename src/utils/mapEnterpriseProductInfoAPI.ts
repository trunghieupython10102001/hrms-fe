import { EEnterpriseType, IEnterpriseProduct, IEnterpriseProductAPIResponse } from '@/interface/business';
import moment from 'moment';

export function mapAPIProductResponseToProductInfo(data: IEnterpriseProductAPIResponse): IEnterpriseProduct {
  return {
    productID: data.BusinessDetailID,
    enterpriseID: data.BusinessID,
    enterpriseName: data.BusinessName,
    createAt: moment(data.CreateTime).format('DD/MM/YYYY hh:mm'),
    createBy: data.CreateUser,
    detailInfo: data.BusinessType === 1 ? data.ExportProductDetail : data.ImportProductDetail,
    enterpriseType: EEnterpriseType[data.BusinessType],
    price: data.UnitPrice,
  };
}

export function mapProductInfoToAPIRequest(
  data: IEnterpriseProduct,
  isDelete = false,
): {
  businessDetailId: number;
  businessId: number;
  importProductDetail?: string;
  exportProductDetail?: string;
  unitPrice?: string;
  status?: 0 | 1;
} {
  return {
    businessDetailId: data.productID,
    businessId: data.enterpriseID,
    exportProductDetail: data.enterpriseType === EEnterpriseType[1] ? data.detailInfo : '',
    importProductDetail: data.enterpriseType === EEnterpriseType[2] ? data.detailInfo : '',
    unitPrice: data.price,
    status: isDelete ? 0 : 1,
  };
}
