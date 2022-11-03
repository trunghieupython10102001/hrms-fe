import { getUserDetail } from '@/api/user.api';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IRole, IUser, IUserRole } from '@/interface/user/user';
import { setGlobalState } from '@/stores/global.store';
import { userAsyncActions } from '@/stores/user.store';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserForm from './shared/UserForm';

import './UserDetail.less';

const mockData: IRole = {
  userID: 2,
  functionID: 1,

  functions: [
    {
      id: 1,
      functionName: 'Quản lý người dùng',
      isDisplay: true,
      isActive: true,
      parentID: 0,
      createdBy: 0,
      createdAt: '2022-10-30T09:33:43.655Z',
      upDatedAt: '2022-10-30T09:34:28.460Z',
      isGrant: true,
      isInsert: true,
      isUpdate: true,
      isDelete: true,
    },
    {
      id: 2,
      isGrant: true,
      isInsert: true,
      isUpdate: true,
      isDelete: true,
      functionName: 'Quản lý người dùng 2',
      isDisplay: true,
      isActive: true,
      parentID: 0,
      createdBy: 0,
      createdAt: '2022-10-30T09:34:55.577Z',
      upDatedAt: '2022-10-30T09:34:33.425Z',
    },
  ],
  user: {
    id: 1,
    username: 'hieupt1',
    password: '$argon2id$v=19$m=4096,t=3,p=1$VxjvuMyG8qHOGxZC96hM4A$fxQYiY8o7SOWKoOAqtVXiEnL0dcSxx961TCT5Zv+qjc',
    email: 'hieupt1@gmail.com',
    fullname: 'Phi Trung Hieu',
    phoneNumber: '0961978085',
    dateOfBirth: '1970-01-01T00:00:00.000Z',
    avatarUrl:
      'data:image/jpeg;base64,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',
    createdBy: 1,
    createdAt: '2022-10-29T01:59:52.353Z',
    upDatedAt: '2022-10-29T01:59:52.354Z',
  },
};

export default function UserDetail() {
  const params = useParams();
  const [detailInfo, setDetailInfo] = useState<IUser | undefined>();
  const [userPermisions, setUserPermisions] = useState<IUserRole[]>([]);
  const roleList = useAppSelector(state => state.user.roleList);
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

      setUserPermisions(mockData.functions);
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
      <UserForm user={detailInfo} isEditable={false} userPermisions={userPermisions} />
    </div>
  );
}
