import { createContactHistory } from '@/api/business';
import { IContact, IEnterprise } from '@/interface/business';
import { notification } from 'antd';
import { useState } from 'react';

import ContactForm from './shared/ContactForm';
import './AddNewContact.less';

interface IComponentProps {
  enterprise: IEnterprise;
  contact?: IContact;
  onClose: () => void;
}

export default function EditContact({ enterprise, contact, onClose }: IComponentProps) {
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onEditContact = async (form: IContact) => {
    console.log('Data: ', form);

    setIsSubmittingData(true);
    const submitData = {
      logId: form.logID,
      businessId: enterprise?.id,
      content: form.content,
      note: form.note,
      status: 1,
    };

    try {
      const res = await createContactHistory(submitData);

      console.log('Result: ', res);
      notification.success({
        message: 'Cập nhật thành công',
      });
      onClose();
    } catch (error) {
    } finally {
      setIsSubmittingData(false);
    }
  };

  return (
    <main className="add-new-contact-page">
      <h1 className="page-title">Cập nhật thông tin tiếp cận</h1>
      <p>Doanh nghiệp: {enterprise.name}</p>
      <ContactForm
        data={contact}
        isEditable
        enterprise={enterprise as IEnterprise}
        isSubmitting={isSubmittingData}
        onSubmit={onEditContact}
      />
    </main>
  );
}
