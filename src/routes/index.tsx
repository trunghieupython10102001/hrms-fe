import { FC, lazy, useMemo } from 'react';
import LoginPage from '@/pages/login';
import LayoutPage from '@/pages/layout';
import { Navigate, RouteObject, useRoutes } from 'react-router';
import WrapperRouteComponent from './config';
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
  const userEnterpriseRoles = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);
  const userManagementRoles = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);
  const userCategoriesRoles = userHasRole(ROLES_ID.CATEGORIES_MANAGEMENT, userRoles);

  const routeList = useMemo<RouteObject[]>(() => {
    return [
      {
        path: '/login',
        element: <VoidLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
        // element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
      },
      {
        path: '/',
        element: <LayoutPage />,
        children: [
          {
            index: true,
            element: <Navigate to="nguoi-dung" replace />,
          },
          {
            path: 'nguoi-dung',
            element: (
              <WrapperRouteComponent
                auth
                element={userManagementRoles?.isGrant ? <UserListPage /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'nguoi-dung/tao-moi',
            element: (
              <WrapperRouteComponent
                auth
                element={userManagementRoles?.isInsert ? <CreateNewUser /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'nguoi-dung/:id',
            element: <WrapperRouteComponent auth element={<UserDetail />} titleId="title.dashboard" />,
          },
          {
            path: 'nguoi-dung/:id/chinh-sua',
            element: (
              <WrapperRouteComponent
                auth
                element={userManagementRoles?.isUpdate ? <EditUserInfoPage /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'doanh-nghiep',
            element: (
              <WrapperRouteComponent
                auth
                element={userEnterpriseRoles?.isGrant ? <EnterpriseListPage /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'doanh-nghiep/tao-moi',
            element: (
              <WrapperRouteComponent
                auth
                element={userEnterpriseRoles?.isInsert ? <CreateNewEnterprise /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'doanh-nghiep/:id',
            element: (
              <WrapperRouteComponent
                auth
                element={userEnterpriseRoles?.isGrant ? <DetailEnterprise /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'doanh-nghiep/:id/chinh-sua',
            element: (
              <WrapperRouteComponent
                auth
                element={userEnterpriseRoles?.isUpdate ? <EditEnterpriseInfo /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: 'linh-vuc-kinh-doanh',
            element: (
              <WrapperRouteComponent
                auth
                element={userCategoriesRoles?.isGrant ? <BusinessAreas /> : <NotFound />}
                titleId="title.dashboard"
              />
            ),
          },
          {
            path: '*',
            element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
          },
        ],
      },
    ];
  }, [userEnterpriseRoles, userManagementRoles, userCategoriesRoles]);

  const routes = useRoutes(routeList);

  return routes;
};

export default RenderRouter;
