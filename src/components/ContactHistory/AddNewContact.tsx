import { createContactHistory } from '@/api/business';
import { useAppSelector } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { Button, notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './AddNewContact.less';
import ContactForm from './shared/ContactForm';

export default function AddNewContact() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const enterprise = useAppSelector(state => state.contact.data.contactEnterprise);
  const enterpriseList = useAppSelector(state => state.enterprise.data.enterprises);

  const selectedEnterprise = useMemo(() => {
    if (!enterprise) {
      const enterpriseID = Number(params.get('enterprise'));

      return enterpriseList.find(enterprise => enterprise.id === enterpriseID);
    }

    return enterprise;
  }, []);

  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const onGoBackHandler = () => {
    navigate(-1);
  };

  const onCreateNewContactHistory = async (form: { content: string; note: string }) => {
    setIsSubmittingData(true);
    const submitData = {
      ...form,
      businessId: selectedEnterprise?.id,
      logId: 0,
    };

    try {
      const res = await createContactHistory(submitData);

      console.log('Result: ', res);
      notification.success({
        message: 'Thêm thành công',
        description: 'Dữ liệu lần tiếp cận mới đã được thêm vào cơ sở dữ liệu',
      });
      navigate(-1);
    } catch (error) {
    } finally {
      setIsSubmittingData(false);
    }
  };

  useEffect(() => {
    console.log('Params', params.get('enterprise'));

    if (!selectedEnterprise) {
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
        enterprise={selectedEnterprise as IEnterprise}
        isSubmitting={isSubmittingData}
        onSubmit={onCreateNewContactHistory}
      />
    </main>
  );
}
