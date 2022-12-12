import { IEnterprise, IEnterpriseProduct } from '@/interface/business';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Space, Table, type TableColumnsType, type TablePaginationConfig } from 'antd';
import { useMemo } from 'react';

interface IComponentProps {
  data: IEnterpriseProduct[];
  pagination: TablePaginationConfig | false;
  loading: boolean;
  enterprise: IEnterprise;
  onEditData: (product: IEnterpriseProduct) => void;
  onDeleteProduct: (product: IEnterpriseProduct) => void;
}

export default function EnterpriseProductsList({
  data,
  loading,
  pagination,
  enterprise,
  onDeleteProduct,
  onEditData,
}: IComponentProps) {
  const tableColumns: TableColumnsType<IEnterpriseProduct> = useMemo<TableColumnsType<IEnterpriseProduct>>(() => {
    return [
      {
        title: 'Mã sản phầm',
        dataIndex: 'productID',
        key: 'productID',
        render: productID => <span>{productID}</span>,
      },
      {
        title: enterprise.type === 1 ? 'Sản phẩm xuất khẩu' : 'Sản phẩm nhập khẩu',
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
      {
        render(_, record) {
          return (
            <Space>
              <EditOutlined className="cursor-pointer" onClick={() => onEditData(record)} />
              <DeleteFilled className="cursor-pointer" onClick={() => onDeleteProduct(record)} />
            </Space>
          );
        },
      },
    ];
  }, []);

  return (
    <Table pagination={pagination} rowKey="productID" columns={tableColumns} dataSource={data} loading={loading} />
  );
}
