import { FC, lazy } from 'react';
// import Dashboard from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import LayoutPage from '@/pages/layout';
import { Navigate, RouteObject } from 'react-router';
import WrapperRouteComponent from './config';
import { useRoutes } from 'react-router-dom';
import VoidLayout from '@/pages/layout/VoidLayout';
import UserListPage from '@/pages/users';
import CreateNewUser from '@/pages/users/CreateNewUser';
import UserDetail from '@/pages/users/UserDetail';
import EnterpriseListPage from '@/pages/Enterprise';
import DetailEnterprise from '@/pages/Enterprise/DetailEnterprise';
import CreateNewEnterprise from '@/pages/Enterprise/CreateNewEnterprise';
import ContactHistoryListPage from '@/pages/ContactHistory/ContactHitories';
import AddNewContact from '@/pages/ContactHistory/AddNewContact';
import BusinessAreas from '@/pages/BusinessArea';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));

const routeList: RouteObject[] = [
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
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        index: true,
        element: <Navigate to="nguoi-dung" replace />,
      },
      // {
      //   path: 'dashboard',
      //   element: <WrapperRouteComponent auth element={<Dashboard />} titleId="title.dashboard" />,
      // },
      {
        path: 'nguoi-dung',
        element: <WrapperRouteComponent auth element={<UserListPage />} titleId="title.dashboard" />,
      },
      {
        path: 'nguoi-dung/tao-moi',
        element: <WrapperRouteComponent auth element={<CreateNewUser />} titleId="title.dashboard" />,
      },
      {
        path: 'nguoi-dung/:id',
        element: <WrapperRouteComponent auth element={<UserDetail />} titleId="title.dashboard" />,
      },
      {
        path: 'doanh-nghiep',
        element: <WrapperRouteComponent auth element={<EnterpriseListPage />} titleId="title.dashboard" />,
      },
      {
        path: 'doanh-nghiep/tao-moi',
        element: <WrapperRouteComponent auth element={<CreateNewEnterprise />} titleId="title.dashboard" />,
      },
      {
        path: 'doanh-nghiep/:id',
        element: <WrapperRouteComponent auth element={<DetailEnterprise />} titleId="title.dashboard" />,
      },
      {
        path: 'linh-vuc-kinh-doanh',
        element: <WrapperRouteComponent auth element={<BusinessAreas />} titleId="title.dashboard" />,
      },
      // {
      //   path: 'lich-su-tiep-can',
      //   element: <WrapperRouteComponent auth element={<ContactHistory />} titleId="title.dashboard" />,
      // },
      {
        path: 'lich-su-tiep-can/tao-moi',
        element: <WrapperRouteComponent auth element={<AddNewContact />} titleId="title.dashboard" />,
      },
      {
        path: 'lich-su-tiep-can/:enterpriseID',
        element: <WrapperRouteComponent auth element={<ContactHistoryListPage />} titleId="title.dashboard" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
