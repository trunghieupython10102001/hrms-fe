import { Link, useParams } from 'react-router-dom';
import EnterpriseForm from './shared/EnterpriseForm';

import './DetailEnterprise.less';
import { useEffect, useState } from 'react';
import { IEnterprise } from '@/interface/business';
import { sleep } from '@/utils/misc';

export default function DetailEnterprise() {
  const params = useParams();
  const id = params.id;
  const [detailEnterprise, setDetailEnterprise] = useState<IEnterprise | undefined>();

  console.log(id);

  useEffect(() => {
    const getDetailEnterprise = async (id: string) => {
      await sleep(1000);
      setDetailEnterprise({
        id: Number(id),
        email: 'a@a.a',
        name: 'abc',
        phone: '0123456789',
        status: 0,
        type: 1,
        address: 'Sơn Tây, Hà Nội',
        areaID: 1,
        contactDetail: 'thị xẫ Sơn Tây, thành phố Hà Nội',
        contactedTimes: 1,
        country: 'Việt Nam',
        createTime: '24/01/2001',
        createUser: '',
        note: '',
        updateTime: '24/01/2001',
        updateUser: '',
      });
    };

    getDetailEnterprise(id || '');
  }, [id]);

  return (
    <main className="enterprise-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Thông tin chi tiết doanh nghiệp</h1>
        <Link to="/doanh-nghiep" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <EnterpriseForm data={detailEnterprise} isEditable={false} />
    </main>
  );
}
