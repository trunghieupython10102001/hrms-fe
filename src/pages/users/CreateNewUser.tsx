import UserForm from './shared/UserForm';

import './CreateNewUser.less';
import { Link, useNavigate } from 'react-router-dom';
import { IUser, IUserRole } from '@/interface/user/user';
import { useEffect, useState } from 'react';
import { createNewUser as createNewUserAPI, uploadUserAvatar } from '@/api/user.api';
import { notification } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { userAsyncActions } from '@/stores/user.store';
import _cloneDeep from 'lodash/cloneDeep';
import { editUserRole } from '@/api/user.api';

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
  const roleList = useAppSelector(state => state.user.roleList.data);
  const getRolesStatus = useAppSelector(state => state.user.roleList.status);
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPermissons, setUserPermissons] = useState<IUserRole[]>(roleList);
  const navigator = useNavigate();

  const createNewUser = async (form: { user: IUser; role: IUserRole[]; file?: File }) => {
    setIsSubmitting(true);

    try {
      const result = await createNewUserAPI(form.user);

      console.log('Signup result', result);
      console.log(form);
      const newUserData: IUser = result.data;

      const roles: any = [];

      if (form.role.length > 0) {
        form.role.forEach(role => {
          roles.push(
            editUserRole({
              functionId: role.id,
              userId: newUserData.id as number,
              isDelete: role.isDelete,
              isGrant: role.isGrant,
              isInsert: role.isInsert,
              isUpdate: role.isUpdate,
            }),
          );
        });
      }

      if (roles.length > 0) {
        const result = await (await Promise.all(roles)).flat(10);

        let isValid = true;

        for (let i = 1; i < result.length; i += 2) {
          if (isValid) {
            isValid = !result[i];
          } else {
            break;
          }
        }

        if (!isValid) {
          notification.error({
            message: 'Lỗi hệ thống',
            description: 'Người dùng đã được tạo, nhưng dữ liệu về quyền chưa được lưu lại',
          });

          return;
        }

        if (form.file) {
          const formData = new FormData();

          formData.append('id', String(newUserData.id));
          formData.append('file', form.file);

          const uploadResult = await uploadUserAvatar(formData);

          if (uploadResult.data.status < 199 || uploadResult.data.status > 300) {
            throw new Error('Upload failed');
          }
        }

        notification.success({
          message: 'Tạo người dùng thành công',
          description: 'Thông tin người dùng đã được thêm vào cơ sở dữ liệu',
        });
        navigator('/nguoi-dung');
      }
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
      if (roleList.length === 0 && (getRolesStatus === 'init' || getRolesStatus === 'error')) {
        const [data] = await dispatch(userAsyncActions.getRolesList()).unwrap();
        const transformedData = transformRoleToUserRoles(data);

        setUserPermissons(transformedData);
      }
    };

    getRolesList();
  }, []);

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
