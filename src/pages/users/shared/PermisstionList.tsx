import { IUserRole } from '@/interface/user/user';
import { Checkbox, Table, TableColumnsType } from 'antd';
import _cloneDeep from 'lodash/cloneDeep';
import _some from 'lodash/some';

interface IComponentProps {
  isEditable: boolean;
  roles?: IUserRole[];
  onUpdateRole: (index: number, key: string) => void;
  onSelectAllRole: (index: number) => void;
}

export default function PermisstionList({ isEditable, roles, onSelectAllRole, onUpdateRole }: IComponentProps) {
  const tableColumns: TableColumnsType<IUserRole> = [
    {
      title: 'Tên quyền',
      dataIndex: 'functionName',
      key: 'functionName',
      render: name => <span className="capitalized">{name}</span>,
    },
    {
      title: 'Được xem',
      dataIndex: 'isGrant',
      key: 'isGrant',
      render: (isGrant, _, i) => (
        <Checkbox onChange={() => onUpdateRole(i, 'isGrant')} checked={isGrant} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được thêm',
      dataIndex: 'isInsert',
      key: 'isInsert',
      render: (isInsert, _, i) => (
        <Checkbox onChange={() => onUpdateRole(i, 'isInsert')} checked={isInsert} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được sửa',
      dataIndex: 'isUpdate',
      key: 'isUpdate',
      render: (isUpdate, _, i) => (
        <Checkbox onChange={() => onUpdateRole(i, 'isUpdate')} checked={isUpdate} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được xóa',
      dataIndex: 'isDelete',
      key: 'isDelete',
      render: (isDelete, _, i) => (
        <Checkbox onChange={() => onUpdateRole(i, 'isDelete')} checked={isDelete} disabled={!isEditable} />
      ),
    },
    {
      title: 'Chọn toàn bộ',
      key: 'all',
      render: (_, record, i) => (
        <Checkbox
          onChange={() => onSelectAllRole(i)}
          checked={record.isGrant && record.isUpdate && record.isInsert && record.isDelete}
          disabled={!isEditable}
        />
      ),
    },
  ];

  return <Table rowKey="id" columns={tableColumns} dataSource={roles} pagination={false}></Table>;
}
