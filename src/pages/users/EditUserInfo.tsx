import { editUser, getUserDetail } from '@/api/user.api';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import type { IUser, IUserRole } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { userAsyncActions } from '@/stores/user.store';
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
  const dispatch = useAppDispatch();

  const editUserHandler = async (data: { user: IUser; role: IUserRole[] }) => {
    console.log('User: ', data);

    const [result, error] = await editUser(Number(params.id) || NaN, data.user);

    console.log('Result: ', result);

    if (error) {
      notification.error({
        message: 'Cập nhật người dùng không thành công',
      });

      return;
    }

    notification.success({
      message: 'Cập nhật thành công',
    });
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
      />
    </div>
  );
}
