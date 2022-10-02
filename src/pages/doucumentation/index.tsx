import { FC, Key, useState } from 'react';

import { Button, Space, Table } from 'antd';
import UserFormModal from './UserFormModal';

const { Column } = Table;

interface DataType {
  key: React.Key;
  username: string;
  password: string;
  email: string;
  fullname: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatarUrl?: string;
}

const data: DataType[] = [
  {
    key: 1,
    username: 'hieupt',
    password: 'hieupt123',
    email: 'hieupt@gmail.com',
    fullname: 'Phi Trung Hieu',
    phoneNumber: '01334114341',
    dateOfBirth: new Date().toLocaleDateString(),
  },
  {
    key: 2,
    username: 'hieupt',
    password: 'hieupt123',
    email: 'hieupt@gmail.com',
    fullname: 'Phi Trung Hieu',
    phoneNumber: '01334114341',
    dateOfBirth: new Date().toLocaleDateString(),
  },
  {
    key: 3,
    username: 'hieupt',
    password: 'hieupt123',
    email: 'hieupt@gmail.com',
    fullname: 'Phi Trung Hieu',
    phoneNumber: '01334114341',
    dateOfBirth: new Date().toLocaleDateString(),
  },
  {
    key: 4,
    username: 'hieupt',
    password: 'hieupt123',
    email: 'hieupt@gmail.com',
    fullname: 'Phi Trung Hieu',
    phoneNumber: '01334114341',
    dateOfBirth: new Date().toLocaleDateString(),
  },
];

const DocumentationPage: FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [record, setRecord] = useState();
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const handleModalVisible = () => {
    setIsUserFormVisible(true);
  };
  // const [loading, setLoading] = useState(false);

  // const start = () => {
  //   setLoading(true);
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div style={{ marginBottom: '4px' }}>
        <Button
          type="primary"
          onClick={() => {
            handleModalVisible();
            setRecord(undefined);
          }}
        >
          New user
        </Button>
        <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
      </div>
      <UserFormModal record={record} visible={isUserFormVisible} setVisible={setIsUserFormVisible} />
      <Table rowSelection={rowSelection} dataSource={data}>
        <Column title="Username" dataIndex="username" key="username" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Fullname" dataIndex="fullname" key="fullname" />
        <Column title="Phone number" dataIndex="phoneNumber" key="phoneNumber" />
        <Column title="Date of birth" dataIndex="dateOfBirth" key="dateOfBirth" />

        <Column
          title="Action"
          key="action"
          render={(_: any, record) => (
            <Space size="middle">
              <a>Edit</a>
              <a>Delete</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DocumentationPage;
