import { FC, useState } from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import './index.less';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginParams } from '@/interface/user/login';
import Logo from '@/assets/logo/Logo.jpg';
import { userAsyncActions } from '@/stores/user.store';
import { formatSearch } from '@/utils/formatSearch';
import { useAppDispatch } from '@/hooks/store';
import { bussinessAreaAsyncActions } from '@/stores/businessArea.store';

const initialValues: LoginParams = {
  username: '',
  password: '',
  remember: true,
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinished = async (form: LoginParams) => {
    setIsSubmitting(true);

    const [, error] = await dispatch(userAsyncActions.login(form)).unwrap();

    if (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Đăng nhập không thành công',
      });
      setIsSubmitting(false);
    } else {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };

      dispatch(bussinessAreaAsyncActions.getBusinessAreaList()).unwrap();
      dispatch(userAsyncActions.getRolesList()).unwrap();
      const [userRoles, roleErrors] = await dispatch(userAsyncActions.getUserRole()).unwrap();

      console.log('Role data: ', userRoles, roleErrors);
      notification.success({
        message: 'Đăng nhập thành công',
      });
      navigate(from);
    }
  };

  return (
    <div className="login-page">
      <img src={Logo} alt="" />
      <Form<LoginParams>
        form={form}
        onFinish={onFinished}
        className="login-page-form"
        initialValues={initialValues}
        requiredMark={false}
        layout="vertical"
      >
        <h2>Đăng nhập</h2>
        <Form.Item
          name="username"
          label="Tài khoản"
          rules={[{ required: true, message: 'Tài khoản không được để trống' }]}
        >
          <Input placeholder="Tài khoản" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
        >
          <Input type="password" placeholder="mật khẩu" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button" loading={isSubmitting}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
