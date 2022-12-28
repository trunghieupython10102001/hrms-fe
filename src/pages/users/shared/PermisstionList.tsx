import { ROLES_ID, ROLE_CHILD_PARENT } from '@/constants/roles';
import { IUserRole } from '@/interface/user/user';
import { Checkbox, Table, TableColumnsType } from 'antd';
import _cloneDeep from 'lodash/cloneDeep';
import { useMemo } from 'react';

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
      render: (isGrant, record) => (
        <Checkbox onChange={() => onUpdateRole(record.id, 'isGrant')} checked={isGrant} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được thêm',
      dataIndex: 'isInsert',
      key: 'isInsert',
      render: (isInsert, record) => (
        <Checkbox onChange={() => onUpdateRole(record.id, 'isInsert')} checked={isInsert} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được sửa',
      dataIndex: 'isUpdate',
      key: 'isUpdate',
      render: (isUpdate, record) => (
        <Checkbox onChange={() => onUpdateRole(record.id, 'isUpdate')} checked={isUpdate} disabled={!isEditable} />
      ),
    },
    {
      title: 'Được xóa',
      dataIndex: 'isDelete',
      key: 'isDelete',
      render: (isDelete, record) => (
        <Checkbox onChange={() => onUpdateRole(record.id, 'isDelete')} checked={isDelete} disabled={!isEditable} />
      ),
    },
    {
      title: 'Chọn toàn bộ',
      key: 'all',
      render: (_, record) => (
        <Checkbox
          onChange={() => onSelectAllRole(record.id)}
          checked={record.isGrant && record.isUpdate && record.isInsert && record.isDelete}
          disabled={!isEditable}
        />
      ),
    },
  ];

  const tableRoleData = useMemo(() => {
    if (!roles) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tableData = [];
    const cloneRoleList = _cloneDeep(roles);

    cloneRoleList.forEach(role => {
      if (role.id in ROLE_CHILD_PARENT) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let roleParent = tableData.find(roleData => roleData.id === ROLE_CHILD_PARENT[role.id]);
        const isPushedToRoleList = !!roleParent;

        if (!roleParent) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          roleParent = roles.find(roleData => roleData.id === ROLE_CHILD_PARENT[role.id]);
        }

        if (!roleParent) {
          tableData.push(role);
        } else {
          if ('children' in roleParent) {
            roleParent.children.push(role);
          } else {
            roleParent.children = [role];
          }

          if (!isPushedToRoleList) {
            tableData.push(roleParent);
          }
        }
      } else {
        tableData.push(role);
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return tableData;
  }, [roles]);

  return (
    <Table
      rowKey="id"
      columns={tableColumns}
      dataSource={tableRoleData}
      expandable={{
        defaultExpandAllRows: true,
        defaultExpandedRowKeys: [ROLE_CHILD_PARENT[ROLES_ID.CONTACT_LOG_MANAGEMENT]],
        expandIcon: () => null,
        indentSize: 24,
      }}
      pagination={false}
    ></Table>
  );
}
