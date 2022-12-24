import { changeUserPassword } from '@/api/user.api';
import { Modal, Form, Input, Button, notification } from 'antd';
import { useState } from 'react';

import './style.less';

interface IComponentProps {
  isShow: boolean;
  onClose: () => void;
}

interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultForm: IChangePasswordForm = {
  confirmPassword: '',
  newPassword: '',
  oldPassword: '',
};

export default function ChangePasswordModal({ isShow, onClose }: IComponentProps) {
  const [form] = Form.useForm<IChangePasswordForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changePasswordHandler = async () => {
    setIsSubmitting(true);

    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      const response = await changeUserPassword(formData);

      if (response.data.status === 200) {
        notification.success({
          message: 'Cập nhật mật khẩu thành công',
        });
        onClose();
      } else if (response.data.message === 'Wrong password') {
        notification.error({
          message: 'Sai mật khẩu',
        });
      } else {
        notification.error({
          message: 'Có lỗi xảy ra, không thể cập nhật mật khẩu mới',
        });
      }
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isShow}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
      className="change-password-modal"
    >
      <h1>Đổi mật khẩu</h1>
      <Form<IChangePasswordForm>
        form={form}
        initialValues={defaultForm}
        layout="vertical"
        onFinish={changePasswordHandler}
        validateTrigger="onBlur"
      >
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Vui lòng nhập đúng mật khẩu mới!'));
              },
              //   validateTrigger: 'onBlur',
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <div className="submit-container">
          <Button type="default">Hủy</Button>
          <Button htmlType="submit" type="primary" loading={isSubmitting}>
            Lưu thông tin
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
