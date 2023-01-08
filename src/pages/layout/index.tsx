import { FC, useEffect, useState, Suspense } from 'react';
import { Layout, Drawer } from 'antd';
import './index.less';
import MenuComponent from './menu';
import HeaderComponent from './header';
import { getGlobalState } from '@/utils/getGloabal';
import TagsView from './tagView';
import { MenuList } from '@/interface/layout/menu.interface';
import { Outlet, useLocation } from 'react-router';
import { setPasswordModalVisibility, setUserItem } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';
import { getFirstPathCode } from '@/utils/getFirstPathCode';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/store';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
import ChangePasswordModal from '@/components/ChangePasswordModal';

const { Sider, Content } = Layout;
const WIDTH = 992;

const LayoutPage: FC = () => {
  const location = useLocation();
  const [openKey, setOpenkey] = useState<string>(location.pathname);
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed, isChangingPassword } = useSelector(state => state.user);

  const isMobile = device === 'MOBILE';

  const userRoles = useAppSelector(state => state.user.role.data);
  const userEnterpriseRoles = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);
  const userManagementRoles = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);
  const userCategoriesRoles = userHasRole(ROLES_ID.CATEGORIES_MANAGEMENT, userRoles);

  const dispatch = useDispatch();

  const closePasswordChangeModal = () => {
    dispatch(setPasswordModalVisibility(false));
  };

  useEffect(() => {
    const code = getFirstPathCode(location.pathname);

    setOpenkey(code);
  }, [location.pathname]);

  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed,
      }),
    );
  };

  useEffect(() => {
    const menuList = [];

    if (userManagementRoles?.isGrant) {
      menuList.push({
        code: '/nguoi-dung',
        label: 'Danh sách người dùng',
        path: '/nguoi-dung',
        icon: <UsergroupAddOutlined />,
      });
    }
    if (userEnterpriseRoles?.isGrant) {
      menuList.push({
        code: '/doanh-nghiep',
        label: 'Danh sách doanh nghiệp',
        path: '/doanh-nghiep',
        icon: <UsergroupAddOutlined />,
      });
    }
    if (userCategoriesRoles?.isGrant) {
      menuList.push({
        code: '/linh-vuc-kinh-doanh',
        label: 'Quản lý lĩnh vực kinh doanh',
        path: '/linh-vuc-kinh-doanh',
        icon: <UsergroupAddOutlined />,
      });
    }

    setMenuList(menuList);
  }, [userRoles]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;

      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse,
        }),
      );
    };
  }, [dispatch]);

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
      <Layout>
        {!isMobile ? (
          <Sider
            className="layout-page-sider"
            trigger={null}
            collapsible
            collapsedWidth={isMobile ? 0 : 80}
            collapsed={collapsed}
            breakpoint="md"
            width={350}
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k as string)}
              selectedKey={openKey}
              onChangeSelectedKey={k => setOpenkey(k)}
            />
          </Sider>
        ) : (
          <Drawer
            width="300"
            placement="left"
            bodyStyle={{ padding: 0, height: '100%' }}
            closable={false}
            onClose={toggle}
            visible={!collapsed}
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k as string)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Drawer>
        )}
        <Content className="layout-page-content">
          <TagsView />
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </Content>

        <ChangePasswordModal isShow={isChangingPassword} onClose={closePasswordChangeModal} />
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
