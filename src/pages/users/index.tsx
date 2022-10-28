import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Button, Input } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import './index.less';
import UserList from './UserList';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function UserListPage() {
  const [queryParams, setQueryParams] = useSearchParams();
  const data = useAppSelector(state => state.enterprise.data.enterprises);
  const loadingStatus = useAppSelector(state => state.enterprise.status);
  const total = useAppSelector(state => state.enterprise.data.total);

  const dispatch = useAppDispatch();

  const pagination = useMemo(() => {
    return {
      current: Number(queryParams.get(QUERY_KEYS.KEY_PAGE_NUMBER)) || DEFAULT_PAGE,
      pageSize: Number(queryParams.get(QUERY_KEYS.KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE,
      total: total || 0,
    };
  }, [queryParams, total]);

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
  };

  useEffect(() => {
    dispatch(enterpriseAsyncActions.getEnterpriseList());
  }, [dispatch]);

  return (
    <div className="user-list-page">
      <h1 className="page-title">Danh sách người dùng</h1>
      <div className="page-action-main">
        <Input.Search placeholder="Tìm kiếm" onSearch={onSearchUser} enterButton />
        <Button type="primary">Thêm mới</Button>
      </div>
      <UserList data={data} pagination={pagination} loading={loadingStatus === 'loading'} />
    </div>
  );
}
