import { QUERY_KEYS } from '@/constants/keys';
import { ROLES_ID } from '@/constants/roles';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { userAsyncActions } from '@/stores/user.store';
import { userHasRole } from '@/utils/hasRole';
import { Input, notification } from 'antd';
import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UserList from './UserList';

import './index.less';
import { deleteUser } from '@/api/user.api';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function UserListPage() {
  const [queryParams, setQueryParams] = useSearchParams();
  const data = useAppSelector(state => state.user.userList.data);
  const loadingStatus = useAppSelector(state => state.user.userList.status);
  const total = useAppSelector(state => state.user.userList.totalUser);
  const userRoles = useAppSelector(state => state.user.role.data);
  const userRole = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);

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

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
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
    dispatch(userAsyncActions.getUserList());
  }, [dispatch]);

  return (
    <div className="user-list-page">
      <h1 className="page-title">Danh sách người dùng</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm theo tên người dùng"
          onSearch={onSearchUser}
          enterButton
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
