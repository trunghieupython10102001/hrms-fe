import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { productAsyncActions } from '@/stores/product.store';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EnterpriseProductsTable from './shared/EnterpriseProductsList';

import './index.less';
import { EEnterpriseType, IEnterprise, IEnterpriseProduct } from '@/interface/business';
import AddNewProduct from './AddNewProduct';
import { mapProductInfoToAPIRequest } from '@/utils/mapEnterpriseProductInfoAPI';
import { createProduct } from '@/api/business';

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
  const [activeProduct, setActiveProduct] = useState<IEnterpriseProduct | undefined>();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const search = queryParams.get(QUERY_KEYS.SEARCH) || '';

  const hideCreateFormHandler = () => {
    setIsShowCreateForm(false);
    setActiveProduct(undefined);
  };

  const showCreateFormHandler = () => {
    setIsShowCreateForm(true);
  };

  const showEditFormHandler = (product: IEnterpriseProduct) => {
    console.log('Data: ', product);

    setActiveProduct(product);
    setIsShowCreateForm(true);
  };

  const closeCreateProductModalHandler = () => {
    setIsShowCreateForm(false);
    dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID) }));
  };

  const tryDeleteProductHandler = (product: IEnterpriseProduct) => {
    setActiveProduct(product);
    setIsShowDeleteModal(true);
  };

  const hideDeleteProductHandler = () => {
    setActiveProduct(undefined);
    setIsShowDeleteModal(false);
  };

  const deleteProductHandler = async (product: IEnterpriseProduct) => {
    try {
      const res = await createProduct(mapProductInfoToAPIRequest(product, true));

      console.log(res);

      if (res.data.code > 0) {
        notification.success({
          message: 'Xóa thành công',
          // description: 'Dữ liệu sản phẩm đã bị xóa',
        });
        dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID) }));
      } else {
        notification.error({
          message: 'Thêm sản phẩm không thành công',
          description: 'Lỗi hệ thống',
        });
      }

      hideDeleteProductHandler();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const onSearchProduct = (searchValue: string) => {
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
    dispatch(productAsyncActions.getListProducts({ businessId: Number(enterpriseID), search }));
  }, [search]);

  return (
    <main className="enterprise-product-list-page">
      <h1 className="page-title">Danh sách sản phẩm của doanh nghiệp</h1>
      <div>
        <h2>Thông tin doanh nghiệp</h2>
        <p>Mã doanh nghiệp: {enterprise.id}</p>
        <p>Tên doanh nghiệp: {enterprise.name} </p>
        <p>Loại hình doanh nghiệp: {EEnterpriseType[enterprise.type]}</p>
      </div>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo mã"
          onSearch={onSearchProduct}
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
        enterprise={enterprise}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
          hideOnSinglePage: true,
        }}
        loading={dataStatus === 'loading'}
        onDeleteProduct={tryDeleteProductHandler}
        onEditData={showEditFormHandler}
      />

      <Modal
        className="delete-product-modal"
        visible={isShowDeleteModal}
        onCancel={hideDeleteProductHandler}
        footer={null}
        destroyOnClose
      >
        <h3>Bạn có chắc chắn muốn xóa sản phẩm?</h3>
        <p>Mã sản phẩm {activeProduct?.productID} </p>
        <div className="btn-container">
          <Button className="btn btn--cancel" onClick={hideDeleteProductHandler} type="primary">
            Hủy
          </Button>
          <Button
            className="btn btn--confirm"
            onClick={() => deleteProductHandler(activeProduct as IEnterpriseProduct)}
            type="primary"
            danger
          >
            Đồng ý
          </Button>
        </div>
      </Modal>
      <Modal
        visible={isShowCreateForm}
        onCancel={hideCreateFormHandler}
        footer={null}
        width={window.innerWidth / 2}
        destroyOnClose
      >
        <AddNewProduct product={activeProduct} enterprise={enterprise} onClose={closeCreateProductModalHandler} />
      </Modal>
    </main>
  );
}
