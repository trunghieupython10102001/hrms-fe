import { ROLES_ID } from '@/constants/roles';
import { useAppSelector } from '@/hooks/store';
import { IUser, IUserRole } from '@/interface/user/user';
import { userHasRole } from '@/utils/hasRole';
import { readFileAsync } from '@/utils/promisifiedFileReader';
import { CloseOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, notification, Upload, UploadProps } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import PermisstionList from './PermisstionList';
import _cloneDeep from 'lodash/cloneDeep';
import './UserForm.less';
import { editUserRole } from '@/api/user.api';

interface IComponentProps {
  user?: IUser;
  isEditable?: boolean;
  isSubmitting?: boolean;
  userPermisions?: IUserRole[];
  onSubmit?: (form: { user: IUser; role: IUserRole[] }) => Promise<void>;
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

export default function UserForm({ user, isEditable = true, isSubmitting, onSubmit, userPermisions }: IComponentProps) {
  const [form] = Form.useForm<IUser>();

  const avatar = form.getFieldValue('avatarUrl');

  const userId = useAppSelector(state => state.user.id);
  const userRoles = useAppSelector(state => state.user.role.data);
  const roleList = useAppSelector(state => state.user.roleList.data);

  const userRole = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);

  const [, forceUpdate] = useState(0);
  const [localRoles, setLocalRoles] = useState<IUserRole[]>([]);
  const [isSubmittingRoleChange, setIsSubmittingRoleChange] = useState(false);

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
      onSubmit({ user: formData, role: localRoles });
    }
  };

  const onUpdateRole = async (index: number, key: string) => {
    const updatePermission = { ...localRoles[index] };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updatePermission[key] = !updatePermission[key];

    if (!user) {
      const updatedPermissionList = _cloneDeep(localRoles);

      updatedPermissionList[index] = updatePermission;

      setLocalRoles(updatedPermissionList);

      return;
    }

    setIsSubmittingRoleChange(true);

    const [_result, error] = await editUserRole({
      functionId: updatePermission.id,
      userId: user?.id as number,
      isDelete: updatePermission.isDelete,
      isGrant: updatePermission.isGrant,
      isInsert: updatePermission.isInsert,
      isUpdate: updatePermission.isUpdate,
    });

    if (!error) {
      const updatedPermissionList = _cloneDeep(localRoles);

      updatedPermissionList[index] = updatePermission;

      setLocalRoles(updatedPermissionList);
      notification.success({
        message: 'Cập nhật dữ liệu thành công',
      });
    } else {
      notification.error({
        message: 'Lỗi hệ thống, không thể cập nhật dữ liệu',
      });
    }

    setIsSubmittingRoleChange(false);
  };

  const onSelectAllRole = async (index: number) => {
    const updatePermission = { ...localRoles[index] };

    if (
      updatePermission.isGrant &&
      updatePermission.isUpdate &&
      updatePermission.isInsert &&
      updatePermission.isDelete
    ) {
      updatePermission.isGrant = false;
      updatePermission.isUpdate = false;
      updatePermission.isInsert = false;
      updatePermission.isDelete = false;
    } else {
      updatePermission.isGrant = true;
      updatePermission.isUpdate = true;
      updatePermission.isInsert = true;
      updatePermission.isDelete = true;
    }

    if (!user) {
      const updatedPermissionList = _cloneDeep(localRoles);

      updatedPermissionList[index] = updatePermission;

      setLocalRoles(updatedPermissionList);

      return;
    }

    setIsSubmittingRoleChange(true);

    const [_result, error] = await editUserRole({
      functionId: updatePermission.id,
      userId: user?.id as number,
      isDelete: updatePermission.isDelete,
      isGrant: updatePermission.isGrant,
      isInsert: updatePermission.isInsert,
      isUpdate: updatePermission.isUpdate,
    });

    if (!error) {
      const updatedPermissionList = _cloneDeep(localRoles);

      updatedPermissionList[index] = updatePermission;

      setLocalRoles(updatedPermissionList);
      notification.success({
        message: 'Cập nhật dữ liệu thành công',
      });
    } else {
      notification.error({
        message: 'Lỗi hệ thống, không thể cập nhật dữ liệu',
      });
    }

    setIsSubmittingRoleChange(false);
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user, dateOfBirth: moment(user.dateOfBirth), password: '' });
      forceUpdate(i => i + 1);
    }
  }, [user]);

  useEffect(() => {
    const updatedRoles = _cloneDeep(roleList);

    if (userPermisions) {
      updatedRoles.forEach(role => {
        const userRole = userPermisions.find(rol => rol.functionID === role.id);

        if (!userRole) {
          role.isGrant = false;
          role.isDelete = false;
          role.isInsert = false;
          role.isUpdate = false;

          return;
        }

        role.isGrant = userRole.isGrant;
        role.isDelete = userRole.isDelete;
        role.isInsert = userRole.isInsert;
        role.isUpdate = userRole.isUpdate;
      });
    }

    setLocalRoles(updatedRoles);
  }, [userPermisions]);

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

      {userRole?.isGrant && (
        <>
          <h2 className="page-title">Quyền hạn của người dùng</h2>
          <PermisstionList
            isEditable={isEditable && !isSubmittingRoleChange}
            roles={localRoles}
            onSelectAllRole={onSelectAllRole}
            onUpdateRole={onUpdateRole}
          />
        </>
      )}

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
