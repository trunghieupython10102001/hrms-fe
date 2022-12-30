import { FC } from 'react';
import { LogoutOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import Avator from '@/assets/header/avator.jpeg';
import Logo from '@/assets/logo/Logo.jpg';
import { logout, setPasswordModalVisibility } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

const HeaderComponent: FC<HeaderProps> = ({ collapsed }) => {
  const { logged, device, id: uid, avatar, username } = useSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toLogin = () => {
    navigate('/login');
  };

  const menuOptionClickHandler: MenuProps['onClick'] = event => {
    const { key: option } = event;

    switch (option) {
      case 'my-account':
        navigate(`/nguoi-dung/${uid}`);

        break;
      case 'change-password':
        dispatch(setPasswordModalVisibility(true));

        break;
      case 'logout':
        dispatch(logout());
        navigate('/login');

        break;

      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={menuOptionClickHandler}>
      <Menu.Item key="my-account">
        <span className="layout-page-user-options">
          <UserOutlined />
          <span>Tài khoản của tôi</span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="change-password">
        <span className="layout-page-user-options">
          <LockOutlined />
          <span>Đổi mật khẩu</span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <span className="layout-page-user-options">
          <LogoutOutlined />
          <span>Đăng xuất</span>
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
        <div className="actions">
          {logged ? (
            <div>
              <span className="welcome">Xin chào, {username}</span>
              <Dropdown overlay={menu} trigger={['click']}>
                <span className="user-action">
                  <img src={avatar || Avator} className="user-avator" alt="avator" />
                </span>
              </Dropdown>
            </div>
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
