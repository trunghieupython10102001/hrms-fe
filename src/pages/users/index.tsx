import { QUERY_KEYS } from '@/constants/keys';
import { ROLES_ID } from '@/constants/roles';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { userAsyncActions } from '@/stores/user.store';
import { userHasRole } from '@/utils/hasRole';
import { Input, notification } from 'antd';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UserList from './shared/UserList';
import { deleteUser } from '@/api/user.api';

import './index.less';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function UserListPage() {
  const loadingStatus = useAppSelector(state => state.user.userList.status);
  const total = useAppSelector(state => state.user.userList.totalUser);
  const userRoles = useAppSelector(state => state.user.role.data);
  const data = useAppSelector(state => state.user.userList.data);

  const userRole = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);

  const [queryParams, setQueryParams] = useSearchParams();

  const [keyword, setKeyword] = useState('');

  const dispatch = useAppDispatch();

  const pagination = useMemo(() => {
    return {
      current: Number(queryParams.get(QUERY_KEYS.KEY_PAGE_NUMBER)) || DEFAULT_PAGE,
      pageSize: Number(queryParams.get(QUERY_KEYS.KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE,
      total: total || 0,
      position: ['bottomCenter'],
      className: 'table-pagination',
    };
  }, [queryParams, total]);

  const updateSearchQueries = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    setKeyword(searchValue);
  };

  const searchProductHandler = () => {
    setKeyword(keyword.trim());
    dispatch(userAsyncActions.getUserList({ [QUERY_KEYS.SEARCH]: keyword || undefined }));
  };

  const trimSearchKeywordHandler = () => {
    setKeyword(keyword.trim());
  };

  const deleteUserHandler = async (uid: number) => {
    const [_result, error] = await deleteUser(uid);

    if (error) {
      notification.error({
        message: 'Xóa người dùng không thành công',
      });

      return;
    }

    notification.success({
      message: 'Xóa người dùng thành công',
    });

    dispatch(userAsyncActions.getUserList());
  };

  useEffect(() => {
    dispatch(userAsyncActions.getUserList({ [QUERY_KEYS.SEARCH]: keyword || undefined }));
  }, [dispatch]);

  useEffect(() => {
    const searchKeywork = queryParams.get(QUERY_KEYS.SEARCH) || '';

    setKeyword(searchKeywork);

    // return () => {
    //   setQueryParams(new URLSearchParams());
    // };
  }, []);

  useEffect(() => {
    if (keyword === '') {
      queryParams.delete(QUERY_KEYS.SEARCH);
    } else {
      queryParams.set(QUERY_KEYS.SEARCH, keyword);
    }

    setQueryParams(queryParams);
  }, [keyword]);

  return (
    <div className="user-list-page">
      <h1 className="page-title">Danh sách người dùng</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm theo tên người dùng"
          value={keyword}
          enterButton
          onChange={updateSearchQueries}
          onSearch={searchProductHandler}
          onBlur={trimSearchKeywordHandler}
        />
        {userRole?.isInsert && (
          <Link to="/nguoi-dung/tao-moi" className="page-navigate-link">
            Thêm mới
          </Link>
        )}
      </div>
      <UserList
        data={data}
        pagination={pagination}
        canDeleteUser={!!userRole?.isDelete}
        loading={loadingStatus === 'loading'}
        onDeleteUser={deleteUserHandler}
      />
    </div>
  );
}
