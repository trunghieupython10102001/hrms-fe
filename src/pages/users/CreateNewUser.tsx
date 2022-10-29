import UserForm from './shared/UserForm';

import './CreateNewUser.less';
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '@/interface/user/user';
import { useState } from 'react';
import { createNewUser as createNewUserAPI } from '@/api/user.api';
import { notification } from 'antd';

export default function CreateNewUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigator = useNavigate();

  const createNewUser = async (form: IUser) => {
    setIsSubmitting(true);

    try {
      const result = await createNewUserAPI(form);

      console.log('Signup result', result);
      notification.success({
        message: 'Tạo người dùng thành công',
        description: 'Thông tin người dùng đã được thêm vào cơ sở dữ liệu',
      });
      navigator('/nguoi-dung');
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Tạo người dùng thất bại',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-create-page">
      <div className="page-title-container">
        <h1 className="page-title">Tạo người dùng mới</h1>
        <Link to="/nguoi-dung" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      <UserForm onSubmit={createNewUser} isSubmitting={isSubmitting} />
    </div>
  );
}
