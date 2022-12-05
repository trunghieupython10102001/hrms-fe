import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Input } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EnterpriseList from './shared/EnterpriseList';

import './index.less';

export default function ContactHistory() {
  const enterpriseList = useAppSelector(state => state.enterprise.data.enterprises);
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
    if (enterpriseList.length === 0) {
      dispatch(enterpriseAsyncActions.getEnterpriseList());
    }
  }, []);

  return (
    <main className="contact-history-list-page">
      <h1 className="page-title">Danh sách lịch sử tiếp cận doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onSearch={onSearchUser}
          enterButton
        />
      </div>
      <EnterpriseList
        data={enterpriseList}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
        }}
        loading={dataStatus === 'loading'}
      />
    </main>
  );
}
