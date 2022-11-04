import { useAppDispatch } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { contactActions } from '@/stores/contact.store';
import { Table, TableColumnsType, TablePaginationConfig } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface IComponentProps {
  data: IEnterprise[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
}

export default function EnterpriseList({ data, pagination, loading }: IComponentProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const goToEnterprise = useCallback((enterprise: IEnterprise) => {
    dispatch(contactActions.setEnterprise(enterprise));
    navigate(`/lich-su-tiep-can/${enterprise.id}`);
  }, []);

  const tableColumns: TableColumnsType<IEnterprise> = useMemo<TableColumnsType<IEnterprise>>(() => {
    return [
      {
        title: 'Mã doanh nghiệp',
        dataIndex: 'id',
        key: 'id',
        render: (id, enterprise) => (
          <span onClick={() => goToEnterprise(enterprise)} style={{ color: 'skyblue', cursor: 'pointer' }}>
            {id}
          </span>
        ),
      },
      {
        title: 'Tên doanh nghiệp',
        dataIndex: 'name',
        key: 'name',
        render: name => <span className="capitalized">{name}</span>,
      },
      {
        title: 'Số lần tiệp cận',
        dataIndex: 'contactedTimes',
        key: 'contactedTimes',
        render: contactedTimes => <span className="capitalized">{contactedTimes}</span>,
      },
    ];
  }, []);

  return <Table pagination={pagination} rowKey="id" columns={tableColumns} dataSource={data} loading={loading} />;
}
