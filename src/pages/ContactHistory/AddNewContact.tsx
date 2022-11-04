import { useAppSelector } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { sleep } from '@/utils/misc';
import { Button, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AddNewContact.less';
import ContactForm from './shared/ContactForm';

export default function AddNewContact() {
  const navigate = useNavigate();
  const enterprise = useAppSelector(state => state.contact.data.contactEnterprise);

  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onGoBackHandler = () => {
    navigate(-1);
  };

  const onCreateNewContactHistory = async (form: { content: string; note: string }) => {
    setIsSubmittingData(true);
    await sleep(1500);
    const submitData = {
      ...form,
      enterpriseId: enterprise?.id,
    };

    console.log('Created history: ', submitData);

    setIsSubmittingData(false);

    notification.success({
      message: 'Thêm thành công',
      description: 'Dữ liệu lần tiếp cận mới đã được thêm vào cơ sở dữ liệu',
    });
    navigate(-1);
  };

  useEffect(() => {
    if (!enterprise) {
      navigate('/lich-su-tiep-can');
    }
  }, []);

  return (
    <main className="add-new-contact-page">
      <div className="page-title-container">
        <h1 className="page-title">Thêm lần tiếp cận mới</h1>
        <Button onClick={onGoBackHandler} className="page-navigate-link">
          Quay lại
        </Button>
      </div>
      <ContactForm
        isEditable
        enterprise={enterprise as IEnterprise}
        isSubmitting={isSubmittingData}
        onSubmit={onCreateNewContactHistory}
      />
    </main>
  );
}
