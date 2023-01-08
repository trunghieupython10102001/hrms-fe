import { createContactHistory } from '@/api/business';
import { IEnterprise } from '@/interface/business';
import { notification } from 'antd';
import { useState } from 'react';

import ContactForm from './shared/ContactForm';
import './AddNewContact.less';

interface IComponentProps {
  enterprise: IEnterprise;
  onClose: () => void;
}

export default function AddNewContact({ enterprise, onClose }: IComponentProps) {
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onCreateNewContactHistory = async (form: { content: string; note: string }) => {
    setIsSubmittingData(true);
    const submitData = {
      ...form,
      businessId: enterprise?.id,
      logId: 0,
    };

    try {
      const _res = await createContactHistory(submitData);

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
      <h1 className="page-title">Thêm lần tiếp cận mới</h1>
      <ContactForm
        isEditable
        enterprise={enterprise as IEnterprise}
        isSubmitting={isSubmittingData}
        onSubmit={onCreateNewContactHistory}
      />
    </main>
  );
}
