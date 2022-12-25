import { editUser, getRefreshToken, getUserDetail, uploadUserAvatar } from '@/api/user.api';
import { CUSTOM_EVENTS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import type { IUser, IUserRole } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { userAsyncActions } from '@/stores/user.store';
import dispatchCustomEvent from '@/utils/dispatchCustomEvent';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserForm from './shared/UserForm';

import './UserDetail.less';

interface IDetailUserInfo {
  user: IUser;
  roles: IUserRole[];
}

export default function EditUserInfoPage() {
  const params = useParams();
  const [detailInfo, setDetailInfo] = useState<IDetailUserInfo | undefined>();
  const roleListStatus = useAppSelector(state => state.user.roleList.status);
  const userId = String(useAppSelector(state => state.user.id));
  const dispatch = useAppDispatch();

  const refreshUserRole = async () => {
    if (params.id !== userId) {
      return;
    }

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        dispatchCustomEvent(CUSTOM_EVENTS.SESSION_EXPIRE);

        return;
      }

      const result = await getRefreshToken(refreshToken);
      const loginTokens = result.data;

      localStorage.setItem('accessToken', loginTokens.accessToken);
      localStorage.setItem('refreshToken', loginTokens.refreshToken);
      dispatch(userAsyncActions.getUserRole());
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const editUserHandler = async (data: { user: IUser; role: IUserRole[]; file?: File }) => {
    try {
      const updateForm = {
        avatarUrl: detailInfo?.user.avatarUrl || '',
        dateOfBirth: new Date(data.user.dateOfBirth.toString()).toISOString(),
        email: data.user.email,
        fullname: data.user.fullname,
        phoneNumber: data.user.phoneNumber,
      };

      if (data.user.password) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateForm.password = data.user.password;
      }
      const [_result, error] = await editUser(Number(params.id) || NaN, updateForm);

      if (error) {
        notification.error({
          message: 'Cập nhật người dùng không thành công',
        });

        return;
      }

      if (data.file) {
        const formData = new FormData();

        formData.append('id', String(params.id));
        formData.append('file', data.file || '');
        const uploadResult = await uploadUserAvatar(formData);

        if (uploadResult.data.status < 199 || uploadResult.data.status > 300) {
          throw new Error('Upload failed');
        }
      }

      notification.success({
        message: 'Cập nhật thành công',
      });
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra, cập nhật thông tin không thành công',
      });
    }
  };

  useEffect(() => {
    const getUserDetailInfo = async () => {
      dispatch(
        setGlobalState({
          loading: true,
        }),
      );

      try {
        const [detail, _error]: [IDetailUserInfo, any] = (await getUserDetail(params.id as string)) as any;

        if (roleListStatus === 'init' || roleListStatus === 'error') {
          await dispatch(userAsyncActions.getRolesList()).unwrap();
        }

        setDetailInfo(detail);
      } catch (error) {
        console.log('Error: ', error);
      }

      dispatch(
        setGlobalState({
          loading: false,
        }),
      );
    };

    getUserDetailInfo();
  }, [params.id]);

  return (
    <div className="user-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Chỉnh sửa thông tin người dùng</h1>
        <div className="page-navigators">
          <Link to="/nguoi-dung" className="page-navigate-link">
            Quay lại
          </Link>
        </div>
      </div>
      <UserForm
        user={detailInfo?.user}
        isEditable
        userPermisions={detailInfo?.roles || ([] as IUserRole[])}
        onSubmit={editUserHandler}
        refreshUserRole={refreshUserRole}
      />
    </div>
  );
}
