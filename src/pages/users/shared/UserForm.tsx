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
  refreshUserRole?: () => void;
  onSubmit?: (form: { user: IUser; role: IUserRole[]; file?: File }) => Promise<void>;
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

const FILE_SIZE_LIMIT = 1024 * 1024;
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

export default function UserForm({
  user,
  isEditable = true,
  isSubmitting,
  userPermisions,
  onSubmit,
  refreshUserRole,
}: IComponentProps) {
  const [form] = Form.useForm<IUser>();

  const avatar = form.getFieldValue('avatarUrl');

  const userId = useAppSelector(state => state.user.id);
  const userRoles = useAppSelector(state => state.user.role.data);
  const roleList = useAppSelector(state => state.user.roleList.data);

  const userRole = userHasRole(ROLES_ID.USER_MANAGEMENT, userRoles);

  const [, forceUpdate] = useState(0);
  const [uploadAvatar, setUploadAvatar] = useState<File | undefined>();
  const [localRoles, setLocalRoles] = useState<IUserRole[]>([]);
  const [isSubmittingRoleChange, setIsSubmittingRoleChange] = useState(false);

  const resetImageURLHandler = () => {
    form.setFields([{ name: 'avatarUrl', value: '' }]);
    forceUpdate(i => i + 1);
  };

  const uploadImageHandler = async ({ file }: IUploadOptions) => {
    const base64URL = await readFileAsync(file, 'readAsDataURL');

    form.setFields([{ name: 'avatarUrl', value: base64URL }]);
    setUploadAvatar(file);
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
      formData.dateOfBirth = new Date(formData.dateOfBirth as any).toUTCString();
    }

    if (onSubmit) {
      formData.createdBy = userId;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete formData.avatarUrl;

      onSubmit({ user: formData, role: localRoles, file: uploadAvatar });
    }

    setUploadAvatar(undefined);
  };

  const onUpdateRole = async (id: IUserRole['id'], key: string) => {
    const updatePermission = localRoles.find(role => role.id === id);

    if (!updatePermission) {
      return;
    }
    const index = localRoles.findIndex(role => role.id === id);

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
        message: 'C???p nh???t d??? li???u th??nh c??ng',
      });

      refreshUserRole?.();
    } else {
      notification.error({
        message: 'L???i h??? th???ng, kh??ng th??? c???p nh???t d??? li???u',
      });
    }

    setIsSubmittingRoleChange(false);
  };

  const onSelectAllRole = async (id: IUserRole['id']) => {
    const updatePermission = localRoles.find(role => role.id === id);
    const index = localRoles.findIndex(role => role.id === id);

    if (!updatePermission) {
      return;
    }
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
        message: 'C???p nh???t d??? li???u th??nh c??ng',
      });
    } else {
      notification.error({
        message: 'L???i h??? th???ng, kh??ng th??? c???p nh???t d??? li???u',
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
            label="Ta??i khoa??n"
            rules={[{ required: true, message: 'Ta??i khoa??n kh??ng ????????c ?????? tr????ng!' }]}
          >
            <Input placeholder="Ta??i khoa??n" disabled={!isEditable || !!user} size="large" />
          </Form.Item>
          <Form.Item
            label="M????t kh????u"
            name="password"
            rules={[{ required: !user, message: 'M????t kh????u kh??ng ????????c ?????? tr????ng' }]}
          >
            <Input.Password autoComplete="false" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item label="A??nh ??a??i di????n" name="avatarUrl" valuePropName="data-value">
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
                <span>Ta??i l??n</span>
              </Upload>
            )}
          </Form.Item>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-1/2">
          <Form.Item name="fullname" label="Ho?? va?? t??n" rules={[{ required: true, message: 'Vui lo??ng nh????p ho?? t??n' }]}>
            <Input placeholder="Ho?? va?? t??n" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item label="Nga??y sinh" name="dateOfBirth">
            <DatePicker style={{ width: '300px' }} format="DD/MM/YYYY" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-1/2">
          <Form.Item
            name="phoneNumber"
            label="S???? ??i????n thoa??i"
            rules={[{ required: true, message: 'Vui lo??ng nh????p s???? ??i????n thoa??i' }]}
          >
            <Input placeholder="S???? ??i????n thoa??i" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
        <div className="w-1/2">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lo??ng nh????p email' },
              {
                type: 'email',
                message: 'Vui lo??ng nh????p email h????p l????',
              },
            ]}
          >
            <Input placeholder="Email" disabled={!isEditable} size="large" />
          </Form.Item>
        </div>
      </div>

      {userRole?.isGrant && (
        <>
          <h2 className="page-title">Quy????n ha??n cu??a ng??????i du??ng</h2>
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
            L??u th??ng tin
          </Button>
        </div>
      )}
    </Form>
  );
}
