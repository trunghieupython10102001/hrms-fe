import { getUserDetail } from '@/api/user.api';
import { ROLES_ID } from '@/constants/roles';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import type { IUser, IUserRole } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { userAsyncActions } from '@/stores/user.store';
import { isNotHasAnyRole, userHasRole } from '@/utils/hasRole';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from '../404';
import UserForm from './shared/UserForm';

import './UserDetail.less';

interface IDetailUserInfo {
  user: IUser;
  roles: IUserRole[];
}

export default function UserDetail() {
  const params = useParams();
  const [detailInfo, setDetailInfo] = useState<IDetailUserInfo | undefined>();
  const roleListStatus = useAppSelector(state => state.user.roleList.status);
  const userRoles = useAppSelector(state => state.user.role.data);
  const userId = useAppSelector(state => state.user.id);
  const userRole = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);
  const dispatch = useAppDispatch();

  const isNotHasRole = isNotHasAnyRole(userRoles);

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

  if (isNotHasRole && Number(params.id) !== userId) {
    return <NotFoundPage />;
  }

  return (
    <div className="user-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Th??ng tin chi ti????t ng??????i du??ng</h1>
        <div className="page-navigators">
          {userRole?.isUpdate && (
            <Link to={`/nguoi-dung/${params.id}/chinh-sua`} className="page-navigate-link edit-link">
              Ch???nh s???a
            </Link>
          )}
          {!isNotHasRole && (
            <Link to="/nguoi-dung" className="page-navigate-link">
              Quay la??i
            </Link>
          )}
        </div>
      </div>
      <UserForm user={detailInfo?.user} isEditable={false} userPermisions={detailInfo?.roles || ([] as IUserRole[])} />
    </div>
  );
}
