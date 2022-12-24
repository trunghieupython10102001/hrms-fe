import { IUser } from '@/interface/user/user';
import { Button, Modal } from 'antd';

interface IComponentProps {
  isOpen: boolean;
  user?: IUser;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteUserModal({ isOpen, user, onCancel, onConfirm }: IComponentProps) {
  return (
    <Modal visible={isOpen} destroyOnClose onCancel={onCancel} footer={null}>
      <h3>Bạn có chắc chắn muốn xóa người dùng {user?.username}?</h3>
      <div className="actions">
        <Button onClick={onCancel} type="primary">
          Hủy
        </Button>
        <Button onClick={onConfirm} type="primary" danger>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
}
