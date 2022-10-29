import { getUserDetail } from '@/api/user.api';
import { useAppDispatch } from '@/hooks/store';
import { IUser } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserForm from './shared/UserForm';

import './UserDetail.less';

export default function UserDetail() {
  const params = useParams();
  const [detailInfo, setDetailInfo] = useState<IUser | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserDetailInfo = async () => {
      dispatch(
        setGlobalState({
          loading: true,
        }),
      );
      const detail: IUser = (await getUserDetail(params.id as string)) as any;

      dispatch(
        setGlobalState({
          loading: false,
        }),
      );
      setDetailInfo(detail);
    };

    getUserDetailInfo();
  }, []);

  return (
    <div className="user-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Thông tin chi tiết người dùng</h1>
        <Link to="/nguoi-dung" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <UserForm user={detailInfo} isEditable={false} />
    </div>
  );
}
