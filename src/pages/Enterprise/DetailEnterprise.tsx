import { Link, useParams } from 'react-router-dom';
import EnterpriseForm from './shared/EnterpriseForm';

import './DetailEnterprise.less';
import { useEffect, useState } from 'react';
import { IEnterprise } from '@/interface/business';
import { getDetailEnterprise } from '@/api/business';
import { mapEnterpriseAPIResponseToEnterprise } from '@/utils/mapEnterpriseAPIResponseToEnterprise';
import { useAppSelector } from '@/hooks/store';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
export default function DetailEnterprise() {
  const params = useParams();
  const id = params.id;
  const [detailEnterprise, setDetailEnterprise] = useState<IEnterprise | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const userRoles = useAppSelector(state => state.user.role.data);
  const userRole = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);

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
        <h1 className="page-title">Thông tin doanh nghiệp</h1>
        <div className="page-navigators">
          {userRole?.isUpdate && (
            <Link to={`/doanh-nghiep/${params.id}/chinh-sua`} className="page-navigate-link edit-link">
              Chỉnh sửa
            </Link>
          )}
          <Link to="/doanh-nghiep" className="page-navigate-link">
            Quay lại
          </Link>
        </div>
      </div>
      <EnterpriseForm data={detailEnterprise} isEditable={false} />
    </main>
  );
}
