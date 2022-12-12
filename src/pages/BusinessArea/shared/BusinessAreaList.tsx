import { IBusinessArea } from '@/interface/businessArea';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, TableColumnsType, TablePaginationConfig } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';

interface IComponentProps {
  data: IBusinessArea[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
  canEdit: boolean;
  canDeleteCategory: boolean;
  onEditArea: (area: IBusinessArea) => void;
  onDeleteArea: (area: IBusinessArea) => void;
}

export default function BusinessAreaList({
  data,
  pagination,
  loading,
  canEdit,
  canDeleteCategory,
  onEditArea,
  onDeleteArea,
}: IComponentProps) {
  const tableColumns: TableColumnsType<IBusinessArea> = useMemo<TableColumnsType<IBusinessArea>>(() => {
    return [
      {
        title: 'Mã lĩnh vực',
        dataIndex: 'id',
        key: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: 'Tên lĩnh vực',
        dataIndex: 'name',
        key: 'name',
        render: name => <span className="capitalized">{name}</span>,
      },
      {
        title: 'Ngày thêm',
        dataIndex: 'createTime',
        key: 'createTime',
        render: createTime => <span className="capitalized">{moment(createTime).format('DD/MM/YYYY')}</span>,
      },
      {
        key: 'actions',
        render: (_, area) => (
          <div>
            {canEdit && (
              <button className="action-btns" onClick={() => onEditArea(area)}>
                <EditOutlined />
              </button>
            )}
            {canDeleteCategory && <DeleteOutlined className="btn btn--delete" onClick={() => onDeleteArea(area)} />}
          </div>
        ),
      },
    ];
  }, []);

  return <Table pagination={pagination} rowKey="id" columns={tableColumns} dataSource={data} loading={loading} />;
}
