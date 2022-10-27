import { FC, useEffect, useState, Suspense } from 'react';
import { Layout, Drawer } from 'antd';
import './index.less';
import MenuComponent from './menu';
import HeaderComponent from './header';
import { getGlobalState } from '@/utils/getGloabal';
import TagsView from './tagView';
import { MenuList } from '@/interface/layout/menu.interface';
import { Outlet, useLocation } from 'react-router';
import { setUserItem } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';
import { getFirstPathCode } from '@/utils/getFirstPathCode';

const { Sider, Content } = Layout;
const WIDTH = 992;

const LayoutPage: FC = () => {
  const location = useLocation();
  const [openKey, setOpenkey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed } = useSelector(state => state.user);
  const isMobile = device === 'MOBILE';
  const dispatch = useDispatch();

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
    setMenuList([
      {
        code: 'dashboard',
        label: {
          zh_CN: '首页',
          en_US: 'Dashboard',
        },
        icon: 'dashboard',
        path: '/dashboard',
      },
      {
        code: 'documentation',
        label: {
          zh_CN: '文档',
          en_US: 'Documentation',
        },
        icon: 'documentation',
        path: '/documentation',
      },
      {
        code: 'permissionManagement',
        label: {
          zh_CN: '文档',
          en_US: 'Permission management',
        },
        icon: 'documentation',
        path: '/permissionManagement',
      },
    ]);
  }, []);

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
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Sider>
        ) : (
          <Drawer
            width="200"
            placement="left"
            bodyStyle={{ padding: 0, height: '100%' }}
            closable={false}
            onClose={toggle}
            visible={!collapsed}
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k)}
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
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
