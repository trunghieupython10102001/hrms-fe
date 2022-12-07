import { IEnterpriseProduct } from '@/interface/business';
import { Table, type TableColumnsType, type TablePaginationConfig } from 'antd';
import { useMemo } from 'react';

interface IComponentProps {
  data: IEnterpriseProduct[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
}

export default function EnterpriseProductsList({ data, loading, pagination }: IComponentProps) {
  const tableColumns: TableColumnsType<IEnterpriseProduct> = useMemo<TableColumnsType<IEnterpriseProduct>>(() => {
    return [
      {
        title: 'Mã sản phầm',
        dataIndex: 'productID',
        key: 'productID',
        render: productID => <span>{productID}</span>,
      },
      {
        title: 'Thông tin sản phẩm',
        dataIndex: 'detailInfo',
        key: 'detailInfo',
        render: detailInfo => <span className="capitalized">{detailInfo}</span>,
      },
      {
        title: 'Thông tin giá cả',
        dataIndex: 'price',
        key: 'price',
        render: price => <span className="capitalized whitespace-pre-line">{price}</span>,
      },
      {
        title: 'Người tạo',
        dataIndex: 'createBy',
        key: 'createBy',
        render: createBy => <span className="capitalized">{createBy}</span>,
      },
      {
        title: 'Thời gian tạo',
        dataIndex: 'createAt',
        key: 'createAt',
        render: createAt => <span className="capitalized">{createAt}</span>,
      },
    ];
  }, []);

  return (
    <Table pagination={pagination} rowKey="productID" columns={tableColumns} dataSource={data} loading={loading} />
  );
}
