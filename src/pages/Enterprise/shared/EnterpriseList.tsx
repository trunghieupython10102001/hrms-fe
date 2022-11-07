import { IEnterprise, EEnterpriseType } from '@/interface/business';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Table, TableColumnsType, TablePaginationConfig } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/store';
import { contactActions } from '@/stores/contact.store';

interface IComponentProps {
  data: IEnterprise[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
}

export default function EnterpriseList({ data, pagination, loading }: IComponentProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onGoToContactHistory: MenuProps['onClick'] = event => {
    const { key } = event;
    const enterpriseID = key.split('/').at(-1);
    const enterprise = data.find(enterprise => {
      console.log({ enterpriseID, id: enterprise.id });

      return String(enterprise.id) === enterpriseID;
    });

    if (!enterprise) {
      return;
    }

    dispatch(contactActions.setEnterprise(enterprise));
    navigate(key);
  };

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
      {
        key: 'actions',
        render: (_, record) => {
          return (
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu style={{ width: 200 }} onClick={onGoToContactHistory}>
                  <Menu.Item key={`/lich-su-tiep-can/${record.id}`}>
                    <div className="menu-item">Lịch sử tiếp cận</div>
                  </Menu.Item>
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
  }, []);

  return <Table pagination={pagination} rowKey="id" columns={tableColumns} dataSource={data} loading={loading} />;
}
