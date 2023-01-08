import { IContact } from '@/interface/business';
import { extractFIleNameFromURL } from '@/utils/misc';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Space, Table, TableColumnsType, TablePaginationConfig } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';

interface IComponentProps {
  data: IContact[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEditContact: (contact: IContact) => void;
  onDeleteContact: (contact: IContact) => void;
}

export default function ContactHistoriesList({
  data,
  loading,
  pagination,
  canDelete,
  canEdit,
  onDeleteContact,
  onEditContact,
}: IComponentProps) {
  const tableColumns: TableColumnsType<IContact> = useMemo<TableColumnsType<IContact>>(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'logID',
        key: 'logID',
        width: 50,
        render: logID => <span>{logID}</span>,
      },
      {
        title: 'Nội dung liên hệ',
        dataIndex: 'content',
        key: 'content',
        width: 300,
        render: content => <span className="capitalized">{content}</span>,
      },
      {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
        width: 400,
        render: note => <span className="capitalized">{note}</span>,
      },
      {
        title: 'Ngày thêm',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        render: createTime => <span className="capitalized">{moment(createTime).format('DD/MM/YYYY')}</span>,
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 150,
        render: updateTime => <span className="capitalized">{moment(updateTime).format('DD/MM/YYYY')}</span>,
      },
      {
        title: 'Tệp đính kèm',
        dataIndex: 'filesAttached',
        key: 'filesAttached',
        width: 200,
        render: filesAttached => (
          <span className="white-space-wrap">{filesAttached ? extractFIleNameFromURL(filesAttached) : ''}</span>
        ),
      },
      {
        width: 50,
        key: 'actions',
        render: (_, contact) => (
          <Space>
            {canEdit && <EditOutlined className="cursor-pointer" onClick={() => onEditContact(contact)} />}
            {canDelete && <DeleteOutlined className="cursor-pointer" onClick={() => onDeleteContact(contact)} />}
          </Space>
        ),
      },
    ];
  }, []);

  return <Table pagination={pagination} rowKey="logID" columns={tableColumns} dataSource={data} loading={loading} />;
}
