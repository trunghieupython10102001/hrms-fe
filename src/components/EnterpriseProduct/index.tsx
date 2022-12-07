import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { productAsyncActions } from '@/stores/product.store';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EnterpriseProductsTable from './shared/EnterpriseProductsList';

import './index.less';
import { IEnterprise } from '@/interface/business';
import AddNewProduct from './AddNewProduct';

interface IComponentProps {
  enterprise: IEnterprise;
}

export default function EnterpriseProductsList({ enterprise }: IComponentProps) {
  const enterpriseID = enterprise.id;
  const dispatch = useAppDispatch();
  const productList = useAppSelector(state => state.product.data.products);
  const dataStatus = useAppSelector(state => state.contact.status);
  const [queryParams, setQueryParams] = useSearchParams();
  const [isShowCreateForm, setIsShowCreateForm] = useState(false);

  const hideCreateFormHandler = () => {
    setIsShowCreateForm(false);
  };

  const showCreateFormHandler = () => {
    setIsShowCreateForm(true);
  };

  const afterSaveDataHandler = () => {
    setIsShowCreateForm(false);
    dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID) }));
  };

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
  };
  const onClearSearchHandler = () => {
    queryParams.delete(QUERY_KEYS.SEARCH);
    setQueryParams(queryParams);
  };

  useEffect(() => {
    dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID) }));
  }, [enterpriseID]);

  useEffect(() => {
    const search = queryParams.get(QUERY_KEYS.SEARCH) || '';

    dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID) }));
  }, [enterpriseID, queryParams]);

  return (
    <main className="enterprise-contact-list-page">
      <h1 className="page-title">Danh sách sản phẩm của doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo mã"
          onSearch={onSearchUser}
          enterButton
          suffix={
            <button className="clear-btn" onClick={onClearSearchHandler}>
              <CloseCircleOutlined />
            </button>
          }
        />

        <Button className="page-navigate-link" onClick={showCreateFormHandler}>
          Thêm mới
        </Button>
      </div>
      <EnterpriseProductsTable
        data={productList}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
          hideOnSinglePage: true,
        }}
        loading={dataStatus === 'loading'}
      />

      <Modal
        visible={isShowCreateForm}
        onCancel={hideCreateFormHandler}
        footer={null}
        width={window.innerWidth / 2}
        destroyOnClose
      >
        <AddNewProduct enterprise={enterprise} onClose={afterSaveDataHandler} />
      </Modal>
    </main>
  );
}
