import { Link, useNavigate } from 'react-router-dom';
import EnterpriseForm from './shared/EnterpriseForm';

import './CreateNewEnterprise.less';
import { IEnterprise } from '@/interface/business';
import { createEnterprise } from '@/api/business';
import { notification } from 'antd';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/store';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';

export default function CreateNewEnterprise() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createNewEnterpriseHandler = async (form: IEnterprise) => {
    console.log('Data: ', form);
    setIsSubmitting(true);
    const _result = await createEnterprise(form);

    setIsSubmitting(false);

    dispatch(enterpriseAsyncActions.getEnterpriseList()).unwrap();
    notification.success({
      message: 'Thêm thành công',
      description: 'Thông tin doanh nghiệp đã được thêm vào cơ sở dữ liệu',
    });
    navigate('/doanh-nghiep');
  };

  return (
    <main className="enterprise-new-page">
      <div className="page-title-container">
        <h1 className="page-title">Thêm doanh nghiệp mới</h1>
        <Link to="/doanh-nghiep" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <EnterpriseForm isSubmitting={isSubmitting} isEditable onSubmit={createNewEnterpriseHandler} />
    </main>
  );
}
