import { useAppSelector } from '@/hooks/store';
import { IUser } from '@/interface/user/user';
import { readFileAsync } from '@/utils/promisifiedFileReader';
import { CloseOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Upload, UploadProps } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

import './UserForm.less';

interface IComponentProps {
  user?: IUser;
  isEditable?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (form: IUser) => Promise<void>;
}

interface IUploadOptions {
  onProgress?: (event: { percent: number }) => void;
  onError?: (event: Error, body?: object) => void;
  onSuccess?: (body: object) => void;
  data?: object;
  filename?: string;
  file: any | File;
  withCredentials?: boolean;
  action?: string;
  headers?: object;
}

const FILE_SIZE_LIMIT = 1024;
const ALLOWED_FILE_EXTENSIONS = ['.png', '.jpg'];

const defaultForm: IUser = {
  username: '',
  password: '',
  fullname: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  avatarUrl: '',
};

export default function UserForm({ user, isEditable = true, isSubmitting, onSubmit }: IComponentProps) {
  const [form] = Form.useForm<IUser>();
  const avatar = form.getFieldValue('avatarUrl');
  const [, forceUpdate] = useState(0);
  const userId = useAppSelector(state => state.user.id);

  const resetImageURLHandler = () => {
    form.setFields([{ name: 'avatarUrl', value: '' }]);
    forceUpdate(i => i + 1);
  };

  const uploadImageHandler = async ({ file }: IUploadOptions) => {
    const base64URL = await readFileAsync(file, 'readAsDataURL');

    form.setFields([{ name: 'avatarUrl', value: base64URL }]);
    forceUpdate(i => i + 1);
  };

  const validateFile: UploadProps['beforeUpload'] = file => {
    for (const extension of ALLOWED_FILE_EXTENSIONS) {
      if (file.name.endsWith(extension)) {
        return true;
      }
    }

    return file.size <= FILE_SIZE_LIMIT ? true : Upload.LIST_IGNORE;
  };

  const onSubmitForm = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();

    if ((formData.dateOfBirth as any) instanceof moment) {
      formData.dateOfBirth = (formData.dateOfBirth as any).toString('DD/MM/YYYY');
    }

    if (onSubmit) {
      formData.createdBy = userId;
      onSubmit(formData);
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user, dateOfBirth: moment(user.dateOfBirth) });
      forceUpdate(i => i + 1);
    }
  }, [user]);

  return (
    <Form
      className="user-form"
      form={form}
      layout="vertical"
      initialValues={{ ...defaultForm }}
      onFinish={onSubmitForm}
    >
      <div className="flex gap-10">
        <div className="w-1/2">
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[{ required: true, message: 'Tài khoản không được để trống!' }]}
          >
            <Input placeholder="Tài khoản" disabled={!isEditable} size="large" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
          >
            <Input.Password disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item label="Ảnh đại diện" name="avatarUrl" valuePropName="data-value">
            {avatar ? (
              <div className="inline-block relative avatar-container">
                <img src={avatar} alt="" className="avatar" />
                {isEditable && (
                  <button className="remove-btn" onClick={resetImageURLHandler}>
                    <CloseOutlined />
                  </button>
                )}
              </div>
            ) : (
              <Upload
                listType="picture-card"
                customRequest={uploadImageHandler}
                maxCount={1}
                disabled={!isEditable}
                beforeUpload={validateFile}
                accept=".png,.jpg"
              >
                <span>Tải lên</span>
              </Upload>
            )}
          </Form.Item>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-1/2">
          <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Họ và tên" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker style={{ width: '300px' }} format="DD/MM/YYYY" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-1/2">
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Số điện thoại" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              {
                type: 'email',
                message: 'Vui lòng nhập email hợp lệ',
              },
            ]}
          >
            <Input placeholder="Email" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
      </div>
      {isEditable && (
        <div className="submit-container">
          <Button htmlType="submit" type="primary" loading={isSubmitting}>
            Lưu thông tin
          </Button>
        </div>
      )}
    </Form>
  );
}
