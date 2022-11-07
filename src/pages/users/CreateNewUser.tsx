import UserForm from './shared/UserForm';

import './CreateNewUser.less';
import { Link, useNavigate } from 'react-router-dom';
import { IUser, IUserRole } from '@/interface/user/user';
import { useEffect, useState } from 'react';
import { createNewUser as createNewUserAPI } from '@/api/user.api';
import { notification } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { userAsyncActions } from '@/stores/user.store';
import _cloneDeep from 'lodash/cloneDeep';

function transformRoleToUserRoles(roles: IUserRole[]) {
  const transformedRoles = _cloneDeep(roles);

  transformedRoles.forEach(role => {
    role.isGrant = false;
    role.isInsert = false;
    role.isUpdate = false;
    role.isDelete = false;
  });

  return transformedRoles;
}

export default function CreateNewUser() {
  const roleList = useAppSelector(state => state.user.roleList);
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPermissons, setUserPermissons] = useState<IUserRole[]>(roleList);
  const navigator = useNavigate();

  const createNewUser = async (form: IUser) => {
    setIsSubmitting(true);

    try {
      const result = await createNewUserAPI(form);

      console.log('Signup result', result);
      notification.success({
        message: 'Tạo người dùng thành công',
        description: 'Thông tin người dùng đã được thêm vào cơ sở dữ liệu',
      });
      navigator('/nguoi-dung');
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Tạo người dùng thất bại',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getRolesList = async () => {
      if (roleList.length === 0) {
        const [data] = await dispatch(userAsyncActions.getRolesList()).unwrap();
        const transformedData = transformRoleToUserRoles(data);

        console.log(transformedData);

        setUserPermissons(transformedData);
      }
    };

    getRolesList();
  }, [roleList]);

  return (
    <div className="user-create-page">
      <div className="page-title-container">
        <h1 className="page-title">Tạo người dùng mới</h1>
        <Link to="/nguoi-dung" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <UserForm onSubmit={createNewUser} isSubmitting={isSubmitting} userPermisions={userPermissons} />
    </div>
  );
}
