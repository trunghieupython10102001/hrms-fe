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
import { UsergroupAddOutlined } from '@ant-design/icons';

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
        code: 'nguoi-dung',
        label: 'Danh sách người dùng',
        path: '/nguoi-dung',
        icon: <UsergroupAddOutlined />,
      },
      {
        code: 'doanh-nghiep',
        label: 'Danh sách doanh nghiệp',
        path: '/doanh-nghiep',
        icon: <UsergroupAddOutlined />,
      },
      {
        code: 'linh-vuc-kinh-doanh',
        label: 'Quản lý lĩnh vực kinh doanh',
        path: '/linh-vuc-kinh-doanh',
        icon: <UsergroupAddOutlined />,
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
            width={350}
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
