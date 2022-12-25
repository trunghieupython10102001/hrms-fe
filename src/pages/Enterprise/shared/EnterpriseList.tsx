import { IEnterprise, EEnterpriseType } from '@/interface/business';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Table, TableColumnsType, TablePaginationConfig } from 'antd';
import type { MenuProps } from 'antd';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IUserRole } from '@/interface/user/user';
import _intersection from 'lodash/intersection';

interface IComponentProps {
  data: IEnterprise[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
  contactLogRole?: IUserRole;
  enterpriseProductRole?: IUserRole;
  selectedRows: number[];
  onShowEnterpriseContactHistory: (enterprise: IEnterprise) => void;
  onShowEnterPriseProducts: (enterprise: IEnterprise) => void;
  onSelectRows: (rowKeys: number[], isSelected: boolean) => void;
}

export default function EnterpriseList({
  data,
  pagination,
  loading,
  contactLogRole,
  enterpriseProductRole,
  selectedRows,
  onSelectRows,
  onShowEnterpriseContactHistory,
  onShowEnterPriseProducts,
}: IComponentProps) {
  const menuItemClickHandler: MenuProps['onClick'] = event => {
    const { key } = event;

    const enterpriseID = key.split('/').at(-1);

    const enterprise = data.find(enterprise => {
      return String(enterprise.id) === enterpriseID;
    });

    if (!enterprise) {
      return;
    }

    if (key.includes('lich-su-tiep-can')) {
      return onShowEnterpriseContactHistory(enterprise);
    }

    onShowEnterPriseProducts(enterprise);
  };

  const rowSelectHandler = (record: IEnterprise, selected: boolean, selectedRows: IEnterprise[]) => {
    console.log('Selections: ', record, selected, selectedRows);
    onSelectRows([record.id], selected);
  };

  const rowSelection = useMemo(() => {
    // const currentPageRows = data.map(enterprise => enterprise.id);
    // const isCheckedAll = _intersection(selectedRows, currentPageRows).length === currentPageRows.length;

    return {
      hideSelectAll: true,
      selectedRowKeys: selectedRows,
      columnTitle: null,
      onSelect: rowSelectHandler,
      renderCell: (_: boolean, _item: IEnterprise, _index: number, originNode: ReactNode) => {
        return originNode;
      },
    };
  }, [data, selectedRows]);

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
        dataIndex: 'phone',
        key: 'phone',
        render: phoneNumber => <span className="capitalized">{phoneNumber}</span>,
      },
      {
        title: 'Số lần tiếp cận',
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
      {
        key: 'actions',
        render: (_, record) => {
          return (
            <Dropdown
              trigger={['click']}
              disabled={!contactLogRole?.isGrant && !enterpriseProductRole?.isGrant}
              overlay={
                <Menu style={{ width: 200 }} onClick={menuItemClickHandler}>
                  {contactLogRole?.isGrant && (
                    <Menu.Item key={`/lich-su-tiep-can/${record.id}`}>
                      <div className="menu-item">Lịch sử tiếp cận</div>
                    </Menu.Item>
                  )}
                  {enterpriseProductRole?.isGrant && (
                    <Menu.Item key={`/mat-hang-kinh-doanh/${record.id}`}>
                      <div className="menu-item">Mặt hàng kinh doanh</div>
                    </Menu.Item>
                  )}
                </Menu>
              }
            >
              <div style={{ cursor: 'pointer' }}>
                <UnorderedListOutlined />
              </div>
            </Dropdown>
          );
        },
      },
    ];
  }, [data]);

  return (
    <Table
      rowSelection={rowSelection}
      pagination={pagination}
      rowKey="id"
      columns={tableColumns}
      dataSource={data}
      loading={loading}
    />
  );
}
