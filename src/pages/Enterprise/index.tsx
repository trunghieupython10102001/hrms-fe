import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Input } from 'antd';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import './index.less';
import EnterpriseList from './shared/EnterpriseList';

export default function EnterpriseListPage() {
  const data = useAppSelector(state => state.enterprise.data.enterprises);
  const dataStatus = useAppSelector(state => state.enterprise.status);
  const dispatch = useAppDispatch();

  const [queryParams, setQueryParams] = useSearchParams();

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
      <EnterpriseList data={data} pagination={false} loading={dataStatus === 'loading'} />
    </main>
  );
}
