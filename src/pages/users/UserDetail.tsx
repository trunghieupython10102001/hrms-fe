import { getUserDetail } from '@/api/user.api';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import './UserDetail.less';

export default function UserDetail() {
  const params = useParams();

  console.log(params);

  useEffect(() => {
    getUserDetail(params.id as string).then(console.log);
  }, []);

  return (
    <div className="user-detail-page">
      <div className="page-title-container">
        <h1 className="page-title">Thông tin chi tiết người dùng</h1>
        <Link to="/nguoi-dung" className="page-navigate-link">
          Quay lại
        </Link>
      </div>
      {/* <UserForm onSubmit={createNewUser} isSubmitting={isSubmitting} /> */}
    </div>
  );
}
