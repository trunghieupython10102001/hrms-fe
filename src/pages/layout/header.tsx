import { FC } from 'react';
import { LogoutOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import Avator from '@/assets/header/avator.jpeg';
import Logo from '@/assets/logo/Logo.jpg';
import { LocaleFormatter } from '@/locales';
import { logout } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, device, id: uid } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        dispatch(logout());
        navigate('/login');

        return;
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span className="layout-page-user-options">
          <UserOutlined />
          <span onClick={() => navigate(`/nguoi-dung/${uid}`)}>
            <LocaleFormatter id="header.avator.account" />
          </span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <span className="layout-page-user-options">
          <LogoutOutlined />
          <span onClick={() => onActionClick('logout')}>
            <LocaleFormatter id="header.avator.logout" />
          </span>
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="layout-page-header bg-2">
      {device !== 'MOBILE' && (
        <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
          <img src={Logo} alt="" />
        </div>
      )}
      <div className="layout-page-header-main">
        <div onClick={toggle}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
        <div className="actions">
          {logged ? (
            <Dropdown overlay={menu}>
              <span className="user-action">
                <img src={Avator} className="user-avator" alt="avator" />
              </span>
            </Dropdown>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={toLogin}>
              Đăng nhập
            </span>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
