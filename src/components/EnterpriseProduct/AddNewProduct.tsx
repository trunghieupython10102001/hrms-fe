import { createProduct } from '@/api/business';
import { IEnterprise, IEnterpriseProduct } from '@/interface/business';
import { notification } from 'antd';
import { useState } from 'react';

import ProductForm from './shared/ProductForm';
import './AddNewProduct.less';
import { mapProductInfoToAPIRequest } from '@/utils/mapEnterpriseProductInfoAPI';

interface IComponentProps {
  enterprise: IEnterprise;
  product?: IEnterpriseProduct;
  onClose: () => void;
}

export default function AddNewProduct({ enterprise, product, onClose }: IComponentProps) {
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onCreateNewProduct = async (form: IEnterpriseProduct) => {
    setIsSubmittingData(true);

    try {
      const res = await createProduct(mapProductInfoToAPIRequest(form));

      if (res.data.code > 0) {
        notification.success({
          message: product ? 'Cập nhật dữ liệu thành công' : 'Thêm thành công',
          description: 'Dữ liệu sản phẩm đã được đưa vào cơ sở dữ liệu',
        });
        onClose();
      } else {
        notification.error({
          message: product ? 'Sửa sản phẩm không thành công' : 'Thêm sản phẩm không thành công',
          description: 'Lỗi hệ thống',
        });
      }
    } catch (error) {
    } finally {
      setIsSubmittingData(false);
    }
  };

  return (
    <main className="add-new-product-page">
      <h2 className="page-title">{enterprise.type === 1 ? 'Sản phẩm xuất khẩu' : 'Sản phẩm nhập khẩu'}</h2>
      <ProductForm
        isEditable
        enterprise={enterprise as IEnterprise}
        data={product}
        isSubmitting={isSubmittingData}
        onSubmit={onCreateNewProduct}
      />
    </main>
  );
}
