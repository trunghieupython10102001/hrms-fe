import { IEnterprise, EEnterpriseType } from '@/interface/business';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Table, Popover, Button, Checkbox } from 'antd';
import type { MenuProps, TableColumnsType, TablePaginationConfig, CheckboxProps } from 'antd';
import { ReactNode, useMemo, useState } from 'react';

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

function TableHeaderCell({
  children,
  onContextMenu,
  dataIndex,
}: {
  children: ReactNode;
  dataIndex: string;
  onContextMenu: (key: string) => void;
}) {
  return (
    <Popover
      title={null}
      overlayClassName="enterprise-list__header__actions-container"
      content={
        <div>
          <Button onClick={() => onContextMenu(dataIndex)} type="text">
            Ẩn trường này
          </Button>
        </div>
      }
      trigger="contextMenu"
    >
      <span className="enterprise-list__header-cell">{children}</span>
    </Popover>
  );
}

const defaultHeaderVisibility = {
  name: true,
  type: true,
  areaName: true,
  email: true,
  phone: true,
  contactedTimes: true,
  address: true,
  actions: true,
  image: true,
};

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
  const [showFields, setShowFields] = useState(defaultHeaderVisibility);

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

  const rowSelectHandler = (record: IEnterprise, selected: boolean) => {
    onSelectRows([record.id], selected);
  };

  const selectAllRowHandler: CheckboxProps['onChange'] = event => {
    const { checked: isChecked } = event.target;

    onSelectRows(
      data.map(row => row.id),
      isChecked,
    );
  };

  const rowSelection = useMemo(() => {
    const selectedRowId = _intersection(
      selectedRows,
      data.map(record => record.id),
    );

    const isCheckedAll = data.length !== 0 && selectedRowId.length === data.length;

    return {
      selectedRowKeys: selectedRows,
      columnTitle: <Checkbox checked={isCheckedAll} onChange={selectAllRowHandler} />,
      onSelect: rowSelectHandler,
      renderCell: (_: boolean, _item: IEnterprise, _index: number, originNode: ReactNode) => {
        return originNode;
      },
    };
  }, [data, selectedRows]);

  const toggleTableHeaderCellVisibilityHandler = (key: string) => {
    const showFieldsList = { ...showFields };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    showFieldsList[key] = !showFieldsList[key];

    setShowFields(showFieldsList);
  };

  const resetHeaderStateHandler = () => {
    setShowFields({ ...defaultHeaderVisibility });
  };

  const tableColumns = useMemo<TableColumnsType<IEnterprise>>(() => {
    const tableHeaderCols: TableColumnsType<IEnterprise> = [];

    tableHeaderCols.push({
      title: 'Mã doanh nghiệp',
      dataIndex: 'id',
      key: 'id',
      width: 124,
      render: id => <Link to={`/doanh-nghiep/${id}`}>{id}</Link>,
    });

    if (showFields.image) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="image" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Ảnh đại diện
          </TableHeaderCell>
        ),
        dataIndex: 'image',
        key: 'image',
        width: 200,
        render: (image: string, record) => (image ? <img src={image} alt={record.name} /> : <span></span>),
      });
    }

    if (showFields.name) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="name" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Tên doanh nghiệp
          </TableHeaderCell>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 228,
        ellipsis: true,
        render: name => <span className="capitalized">{name}</span>,
      });
    }

    if (showFields.type) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="type" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Loại doanh nghiệp
          </TableHeaderCell>
        ),
        dataIndex: 'type',
        key: 'type',
        width: 171,
        render: type => <span className="capitalized">{EEnterpriseType[type]}</span>,
      });
    }

    if (showFields.areaName) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="areaName" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Lĩnh vực kinh doanh
          </TableHeaderCell>
        ),
        dataIndex: 'areaName',
        key: 'areaName',
        width: 177,
        render: areaName => <span className="capitalized">{areaName}</span>,
      });
    }

    if (showFields.email) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="email" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Email
          </TableHeaderCell>
        ),
        dataIndex: 'email',
        key: 'email',
        width: 229,
        render: email => <span>{email}</span>,
      });
    }
    if (showFields.phone) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="phone" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Số điện thoại
          </TableHeaderCell>
        ),
        dataIndex: 'phone',
        key: 'phone',
        width: 128,
        render: phoneNumber => <span className="capitalized">{phoneNumber}</span>,
      });
    }
    if (showFields.contactedTimes) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="contactedTimes" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Số lần tiếp cận
          </TableHeaderCell>
        ),
        dataIndex: 'contactedTimes',
        key: 'contactedTimes',
        width: 138,
        render: contactedTimes => <span className="capitalized">{contactedTimes}</span>,
      });
    }
    if (showFields.address) {
      tableHeaderCols.push({
        title: (
          <TableHeaderCell dataIndex="address" onContextMenu={toggleTableHeaderCellVisibilityHandler}>
            Địa chỉ
          </TableHeaderCell>
        ),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        width: 228,
        render: address => <span className="capitalized">{address}</span>,
      });
    }

    tableHeaderCols.push({
      key: 'actions',
      width: 50,
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
    });

    return tableHeaderCols;
  }, [data, showFields]);

  const isShowResetButton = useMemo<boolean>(() => {
    return Object.values(showFields).reduce((isShow: boolean, show: boolean) => isShow && show);
  }, [showFields]);

  return (
    <div className="enterprise-list-container">
      {!isShowResetButton && (
        <Button className="enterprise-list__reset-btn" type="primary" onClick={resetHeaderStateHandler}>
          Khôi phục bảng
        </Button>
      )}
      <Table
        rowSelection={rowSelection}
        pagination={pagination}
        rowKey="id"
        columns={tableColumns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
}
