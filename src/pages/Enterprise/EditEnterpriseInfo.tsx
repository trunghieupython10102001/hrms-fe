import { Link, useParams } from 'react-router-dom';
import EnterpriseForm from './shared/EnterpriseForm';

import './DetailEnterprise.less';
import { useEffect, useState } from 'react';
import { IEnterprise } from '@/interface/business';
import { getDetailEnterprise } from '@/api/business';
import {
  mapEnterpriseAPIResponseToEnterprise,
  mapEnterpriseInfoToAPIRequest,
} from '@/utils/mapEnterpriseAPIResponseToEnterprise';
import { createEnterprise } from '@/api/business';

export default function EditEnterpriseInfo() {
  const params = useParams();
  const id = params.id;
  const [detailEnterprise, setDetailEnterprise] = useState<IEnterprise | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const onUpdateEnterprise = async (form: IEnterprise) => {
    const data = mapEnterpriseInfoToAPIRequest(form);
    const result = await createEnterprise(mapEnterpriseInfoToAPIRequest(form));

    console.log('Form: ', form, data, result);
  };

  useEffect(() => {
    const getDetailEnterpriseInfo = async (id: string) => {
      setIsLoading(true);

      const response = await getDetailEnterprise(id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [rawDetail] = response.data;
      const detailInfo = mapEnterpriseAPIResponseToEnterprise(rawDetail);

      setDetailEnterprise(detailInfo);
      setIsLoading(false);
    };

    getDetailEnterpriseInfo(id || '');
  }, [id]);

  return (
    <main className="enterprise-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Chỉnh sửa thông tin doanh nghiệp</h1>
        <div className="page-navigators">
          <Link to="/doanh-nghiep" className="page-navigate-link">
            Quay lại
          </Link>
        </div>
      </div>
      <EnterpriseForm data={detailEnterprise} isEditable onSubmit={onUpdateEnterprise} />
    </main>
  );
}
