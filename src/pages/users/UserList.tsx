import { IEnterprise, EEnterpriseStatus, EEnterpriseType } from '@/interface/business';
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface IComponentProps {
  data: IEnterprise[];
  pagination: any;
  loading: boolean;
}

export default function UserList({ data, pagination, loading }: IComponentProps) {
  const tableColumns: TableColumnsType<IEnterprise> = useMemo<TableColumnsType<IEnterprise>>(() => {
    return [
      {
        title: 'Mã doanh nghiệp',
        dataIndex: 'id',
        key: 'id',
        render: id => <Link to={`/nguoi-dung/${id}`}>{id}</Link>,
      },
      {
        title: 'Tên doanh nghiệp',
        dataIndex: 'name',
        key: 'name',
        render: name => <span className="capitalized">{name}</span>,
      },
      {
        title: 'Loại doanh nghiệp',
        dataIndex: 'type',
        key: 'type',
        render: type => <span className="capitalized">{EEnterpriseType[type]}</span>,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: email => <span className="capitalized">{email}</span>,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        render: phone => <span className="capitalized">{phone}</span>,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: status => <span className="capitalized">{EEnterpriseStatus[status]}</span>,
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
