import { FC, useState } from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import './index.less';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginParams } from '@/interface/user/login';
import Logo from '@/assets/logo/Logo.jpg';
import { userAsyncActions } from '@/stores/user.store';
import { formatSearch } from '@/utils/formatSearch';
import { useAppDispatch } from '@/hooks/store';

const initialValues: LoginParams = {
  username: 'guest',
  password: 'guest',
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
    const result = await dispatch(userAsyncActions.login(form)).unwrap();

    setIsSubmitting(false);

    console.log('Result: ', result);

    if (!!result) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };

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
