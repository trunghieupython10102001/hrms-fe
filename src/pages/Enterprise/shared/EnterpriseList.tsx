import { IEnterprise, EEnterpriseType } from '@/interface/business';
import { Table, TableColumnsType, TablePaginationConfig } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface IComponentProps {
  data: IEnterprise[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
}

export default function EnterpriseList({ data, pagination, loading }: IComponentProps) {
  const tableColumns: TableColumnsType<IEnterprise> = useMemo<TableColumnsType<IEnterprise>>(() => {
    return [
      {
        title: 'Mã doanh nghiệp',
        dataIndex: 'id',
        key: 'id',
        render: id => <Link to={`/doanh-nghiep/${id}`}>{id}</Link>,
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
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: phoneNumber => <span className="capitalized">{phoneNumber}</span>,
      },
      {
        title: 'Số lần tiệp cận',
        dataIndex: 'contactedTimes',
        key: 'contactedTimes',
        render: contactedTimes => <span className="capitalized">{contactedTimes}</span>,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        render: address => <span className="capitalized">{address}</span>,
      },
    ];
  }, []);

  return <Table pagination={pagination} rowKey="id" columns={tableColumns} dataSource={data} loading={loading} />;
}
