import { getUserDetail } from '@/api/user.api';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import type { IUser } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { userAsyncActions } from '@/stores/user.store';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserForm from './shared/UserForm';

import './UserDetail.less';

export default function UserDetail() {
  const params = useParams();
  const [detailInfo, setDetailInfo] = useState<IUser | undefined>();
  const roleList = useAppSelector(state => state.user.roleList.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserDetailInfo = async () => {
      dispatch(
        setGlobalState({
          loading: true,
        }),
      );

      try {
        const [detail, _error]: [IUser, any] = (await getUserDetail(params.id as string)) as any;

        if (roleList.length === 0) {
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
        <h1 className="page-title">Thông tin chi tiết người dùng</h1>
        <Link to="/nguoi-dung" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <UserForm user={detailInfo} isEditable={false} userPermisions={roleList} />
    </div>
  );
}
