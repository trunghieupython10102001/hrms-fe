import { IContact } from '@/interface/business';
import { Table, TableColumnsType, TablePaginationConfig } from 'antd';
import { useMemo } from 'react';

interface IComponentProps {
  data: IContact[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
}

export default function ContactHistoriesList({ data, loading, pagination }: IComponentProps) {
  const tableColumns: TableColumnsType<IContact> = useMemo<TableColumnsType<IContact>>(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'logID',
        key: 'logID',
        render: logID => <span>{logID}</span>,
      },
      {
        title: 'Mã doanh nghiệp',
        dataIndex: 'businessID',
        key: 'businessID',
        render: businessID => <span className="capitalized">{businessID}</span>,
      },
      {
        title: 'Nội dung liên hệ',
        dataIndex: 'content',
        key: 'content',
        render: content => <span className="capitalized">{content}</span>,
      },
      {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
        render: note => <span className="capitalized">{note}</span>,
      },
    ];
  }, []);

  return <Table pagination={pagination} rowKey="id" columns={tableColumns} dataSource={data} loading={loading} />;
}
