import { IUserRole } from '@/interface/user/user';
import { Checkbox, Table, TableColumnsType } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _some from 'lodash/some';

interface IComponentProps {
  isEditable: boolean;
  roles?: IUserRole[];
}

export default function PermisstionList({ isEditable, roles }: IComponentProps) {
  const [userPermisions, setUserPermisions] = useState<IUserRole[]>([]);

  const onUpdateRole = useCallback((index: number, key: string) => {
    setUserPermisions(permissions => {
      const newPers = _cloneDeep(permissions);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newPers[index][key] = !newPers[index][key];

      return newPers;
    });
  }, []);

  const onSelectAllRole = useCallback((index: number) => {
    setUserPermisions(permissions => {
      const newPers = _cloneDeep(permissions);
      const permission = newPers[index];

      if (permission.isGrant && permission.isUpdate && permission.isInsert && permission.isDelete) {
        permission.isGrant = false;
        permission.isUpdate = false;
        permission.isInsert = false;
        permission.isDelete = false;
      } else {
        permission.isGrant = true;
        permission.isUpdate = true;
        permission.isInsert = true;
        permission.isDelete = true;
      }

      return newPers;
    });
  }, []);

  const tableColumns: TableColumnsType<IUserRole> = useMemo<TableColumnsType<IUserRole>>(() => {
    return [
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
  }, []);

  useEffect(() => {
    if (roles) {
      setUserPermisions(roles);
    }
  }, [roles]);

  return <Table rowKey="id" columns={tableColumns} dataSource={userPermisions} pagination={false}></Table>;
}
