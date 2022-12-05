import ContactHistoryList from '@/components/ContactHistory/ContactHitories';
import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import './index.less';
import EnterpriseList from './shared/EnterpriseList';

export default function EnterpriseListPage() {
  const data = useAppSelector(state => state.enterprise.data.enterprises);
  const dataStatus = useAppSelector(state => state.enterprise.status);
  const dispatch = useAppDispatch();

  const [queryParams, setQueryParams] = useSearchParams();
  const [activeEnterprise, setActiveEnterprise] = useState<IEnterprise | undefined>();

  const showEnterpriseContactHistoryHandler = (enterprise: IEnterprise) => {
    setActiveEnterprise(enterprise);
  };

  const hideEnterpriseContactHistoryHandler = () => {
    setActiveEnterprise(undefined);
  };

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
  };

  useEffect(() => {
    if (data.length === 0) {
      dispatch(enterpriseAsyncActions.getEnterpriseList());
    }
  }, []);

  return (
    <main className="enterprise-list-page">
      <h1 className="page-title">Danh sách doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onSearch={onSearchUser}
          enterButton
        />
        <Link to="/doanh-nghiep/tao-moi" className="page-navigate-link">
          Thêm mới
        </Link>
      </div>
      <EnterpriseList
        data={data}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
        }}
        loading={dataStatus === 'loading'}
        onShowEnterpriseContactHistory={showEnterpriseContactHistoryHandler}
      />
      <Modal
        visible={!!activeEnterprise}
        onCancel={hideEnterpriseContactHistoryHandler}
        footer={null}
        width={window.innerWidth / 2}
      >
        <ContactHistoryList enterprise={activeEnterprise as IEnterprise} />
      </Modal>
    </main>
  );
}
