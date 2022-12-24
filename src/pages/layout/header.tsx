import { FC } from 'react';
import { LogoutOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LockOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import Avator from '@/assets/header/avator.jpeg';
import Logo from '@/assets/logo/Logo.jpg';
import { LocaleFormatter } from '@/locales';
import { logout, setPasswordModalVisibility } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout' | 'userChangePassword';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, device, id: uid } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userChangePassword':
        dispatch(setPasswordModalVisibility(true));

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
          <span onClick={() => navigate(`/nguoi-dung/${uid}`)}>Tài khoản của tôi</span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <span className="layout-page-user-options">
          <LockOutlined />
          <span onClick={() => onActionClick('userChangePassword')}>Đổi mật khẩu</span>
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <span className="layout-page-user-options">
          <LogoutOutlined />
          <span onClick={() => onActionClick('logout')}>
            {/* <LocaleFormatter id="header.avator.logout" /> */}
            Đăng xuất
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
