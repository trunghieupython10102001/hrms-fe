import { IUser } from '@/interface/user/user';
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';

interface IComponentProps {
  data: IUser[];
  pagination: any;
  loading: boolean;
  canDeleteUser: boolean;
  onDeleteUser: (user: IUser) => void;
}

export default function UserList({ data, pagination, loading, canDeleteUser, onDeleteUser }: IComponentProps) {
  const tableColumns: TableColumnsType<IUser> = useMemo<TableColumnsType<IUser>>(() => {
    return [
      {
        title: 'Mã người dùng',
        dataIndex: 'id',
        key: 'id',
        render: id => <Link to={`/nguoi-dung/${id}`}>{id}</Link>,
      },
      {
        title: 'Tài khoản',
        dataIndex: 'username',
        key: 'username',
        render: username => <span className="capitalized">{username}</span>,
      },
      {
        title: 'Họ tên',
        dataIndex: 'fullname',
        key: 'fullname',
        render: fullname => <span className="capitalized">{fullname}</span>,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: email => <span>{email}</span>,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: phoneNumber => <span className="capitalized">{phoneNumber}</span>,
      },
      {
        title: 'Ngày sinh',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        render: dateOfBirth => <span className="capitalized">{moment(dateOfBirth).format('DD/MM/YYYY')}</span>,
      },
      {
        render(_, record) {
          return (
            <div className="actions-container">
              {canDeleteUser && <DeleteOutlined className="btn btn--delete" onClick={() => onDeleteUser(record)} />}
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <div>
      <Table
        // rowSelection={rowSelection}
        rowKey="id"
        columns={tableColumns}
        pagination={pagination}
        dataSource={data}
        loading={loading}
        // className={classNames(styles.table, '[&_.ant-table-cell]:!min-w-fit')}
        // onChange={onFilterTable}
      />
    </div>
  );
}
