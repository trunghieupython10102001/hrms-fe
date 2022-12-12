import { FC, lazy } from 'react';
// import Dashboard from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import LayoutPage from '@/pages/layout';
import { Navigate } from 'react-router';
import WrapperRouteComponent from './config';
import { Routes, Route } from 'react-router-dom';
import VoidLayout from '@/pages/layout/VoidLayout';
import UserListPage from '@/pages/users';
import CreateNewUser from '@/pages/users/CreateNewUser';
import UserDetail from '@/pages/users/UserDetail';
import EnterpriseListPage from '@/pages/Enterprise';
import DetailEnterprise from '@/pages/Enterprise/DetailEnterprise';
import CreateNewEnterprise from '@/pages/Enterprise/CreateNewEnterprise';
import BusinessAreas from '@/pages/BusinessArea';
import EditUserInfoPage from '@/pages/users/EditUserInfo';
import { useAppSelector } from '@/hooks/store';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
import EditEnterpriseInfo from '@/pages/Enterprise/EditEnterpriseInfo';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));

const RenderRouter: FC = () => {
  const userRoles = useAppSelector(state => state.user.role.data);
  // const userId = useAppSelector(state => state.user.id);
  // const location = useLocation();
  // const navigate = useNavigate();
  const userEnterpriseRoles = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);
  const userManagementRoles = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);
  const userCategoriesRoles = userHasRole(ROLES_ID.CATEGORIES_MANAGEMENT, userRoles);

  // const isNotHasRole = isNotHasAnyRole(userRoles);

  // console.log('location: ', location);

  // useEffect(() => {
  //   if (isNotHasRole && typeof userId !== 'undefined' && location.pathname !== 'nguoi-dung/:id') {
  //     navigate(`/nguoi-dung/${userId}`);
  //   }
  // }, [userRoles, userId, location.pathname]);

  return (
    <Routes>
      <Route element={<VoidLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<LayoutPage />} path="/">
        <Route index element={<Navigate to="nguoi-dung" replace />} />
        <Route
          path="nguoi-dung"
          element={
            <WrapperRouteComponent
              auth
              element={userManagementRoles?.isGrant ? <UserListPage /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="nguoi-dung/tao-moi"
          element={
            <WrapperRouteComponent
              auth
              element={userManagementRoles?.isInsert ? <CreateNewUser /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="nguoi-dung/:id"
          element={<WrapperRouteComponent auth element={<UserDetail />} titleId="title.dashboard" />}
        />
        <Route
          path="nguoi-dung/:id/chinh-sua"
          element={
            <WrapperRouteComponent
              auth
              element={userManagementRoles?.isUpdate ? <EditUserInfoPage /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="doanh-nghiep"
          element={
            <WrapperRouteComponent
              auth
              element={userEnterpriseRoles?.isGrant ? <EnterpriseListPage /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="doanh-nghiep/tao-moi"
          element={
            <WrapperRouteComponent
              auth
              element={userEnterpriseRoles?.isInsert ? <CreateNewEnterprise /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="doanh-nghiep/:id"
          element={
            <WrapperRouteComponent
              auth
              element={userEnterpriseRoles?.isGrant ? <DetailEnterprise /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="doanh-nghiep/:id/chinh-sua"
          element={
            <WrapperRouteComponent
              auth
              element={userEnterpriseRoles?.isUpdate ? <EditEnterpriseInfo /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route
          path="linh-vuc-kinh-doanh"
          element={
            <WrapperRouteComponent
              auth
              element={userCategoriesRoles?.isGrant ? <BusinessAreas /> : <NotFound />}
              titleId="title.dashboard"
            />
          }
        />
        <Route path="*" element={<WrapperRouteComponent auth element={<NotFound />} titleId="title.dashboard" />} />
      </Route>
    </Routes>
  );
};

export default RenderRouter;
