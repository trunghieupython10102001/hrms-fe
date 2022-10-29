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

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
// const Documentation = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/doucumentation'));
const PermissionManagement = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/permissionManagement'));
// const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
// const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
// const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
// const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
// const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
// const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
// const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
// const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
// const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
// const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
// const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
// const BusinessWithRadioCardsPage = lazy(
//   () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
// );
// const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

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
        path: '',
        element: <Navigate to="nguoi-dung" />,
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
      // {
      //   path: 'documentation',
      //   element: <WrapperRouteComponent element={<Documentation />} titleId="title.documentation" />,
      // },
      {
        path: 'quan-ly-nguoi-dung',
        element: <WrapperRouteComponent auth element={<PermissionManagement />} titleId="title.documentation" />,
      },

      /*  {
        path: 'guide',
        element: <WrapperRouteComponent element={<Guide />} titleId="title.guide" />,
      },
      {
        path: 'permission/route',
        element: <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" auth />,
      },
      {
        path: 'component/form',
        element: <WrapperRouteComponent element={<FormPage />} titleId="title.account" />,
      },
      {
        path: 'component/table',
        element: <WrapperRouteComponent element={<TablePage />} titleId="title.account" />,
      },
      {
        path: 'component/search',
        element: <WrapperRouteComponent element={<SearchPage />} titleId="title.account" />,
      },
      {
        path: 'component/tabs',
        element: <WrapperRouteComponent element={<TabsPage />} titleId="title.account" />,
      },
      {
        path: 'component/aside',
        element: <WrapperRouteComponent element={<AsidePage />} titleId="title.account" />,
      },
      {
        path: 'component/radio-cards',
        element: <WrapperRouteComponent element={<RadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/basic',
        element: <WrapperRouteComponent element={<BusinessBasicPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-search',
        element: <WrapperRouteComponent element={<BusinessWithSearchPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-aside',
        element: <WrapperRouteComponent element={<BusinessWithAsidePage />} titleId="title.account" />,
      },
      {
        path: 'business/with-radio-cards',
        element: <WrapperRouteComponent element={<BusinessWithRadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-tabs',
        element: <WrapperRouteComponent element={<BusinessWithTabsPage />} titleId="title.account" />,
      }, */
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
