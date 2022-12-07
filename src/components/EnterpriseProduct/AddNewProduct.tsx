import { createContactHistory } from '@/api/business';
import { IEnterprise } from '@/interface/business';
import { notification } from 'antd';
import { useState } from 'react';

import ProductForm from './shared/ProductForm';
import './AddNewProduct.less';

interface IComponentProps {
  enterprise: IEnterprise;
  onClose: () => void;
}

export default function AddNewProduct({ enterprise, onClose }: IComponentProps) {
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onCreateNewContactHistory = async (form: { content: string; note: string }) => {
    setIsSubmittingData(true);
    const submitData = {
      ...form,
      businessId: enterprise?.id,
      logId: 0,
    };

    try {
      const res = await createContactHistory(submitData);

      console.log('Result: ', res);
      notification.success({
        message: 'Thêm thành công',
        description: 'Dữ liệu lần tiếp cận mới đã được thêm vào cơ sở dữ liệu',
      });
      onClose();
    } catch (error) {
    } finally {
      setIsSubmittingData(false);
    }
  };

  return (
    <main className="add-new-contact-page">
      <h2 className="page-title">Thêm sản phẩm mới</h2>
      <ProductForm
        isEditable
        enterprise={enterprise as IEnterprise}
        isSubmitting={isSubmittingData}
        onSubmit={onCreateNewContactHistory}
      />
    </main>
  );
}
