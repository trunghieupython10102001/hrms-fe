import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { productAsyncActions } from '@/stores/product.store';
import { Button, Input, Modal, notification } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EnterpriseProductsTable from './shared/EnterpriseProductsList';
import _debounce from 'lodash/debounce';

import './index.less';
import { EEnterpriseType, IEnterprise, IEnterpriseProduct } from '@/interface/business';
import AddNewProduct from './AddNewProduct';
import { mapProductInfoToAPIRequest } from '@/utils/mapEnterpriseProductInfoAPI';
import { createProduct } from '@/api/business';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';

interface IComponentProps {
  enterprise: IEnterprise;
}

interface IQuery {
  businessId?: number;
  importProductDetail?: string;
  exportProductDetail?: string;
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
  const [keyword, setKeyword] = useState('');

  const userRoles = useAppSelector(state => state.user.role.data);
  const userEnterpriseProductRole = userHasRole(ROLES_ID.ENTERPRISE_PRODUCT_MANAGEMENT, userRoles);

  const updateSearchQueries = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    setKeyword(searchValue);
  };

  const searchProductHandler = () => {
    const queries: IQuery = {
      businessId: enterpriseID,
    };

    if (enterprise.type === 1) {
      queries.exportProductDetail = keyword.trim() || undefined;
    } else {
      queries.importProductDetail = keyword.trim() || undefined;
    }
    setKeyword(keyword.trim());
    dispatch(productAsyncActions.getListProducts(queries));
  };

  const trimSearchKeywordHandler = () => {
    setKeyword(keyword.trim());
  };

  const hideCreateFormHandler = () => {
    setIsShowCreateForm(false);
    setActiveProduct(undefined);
  };

  const showCreateFormHandler = () => {
    setIsShowCreateForm(true);
  };

  const showEditFormHandler = (product: IEnterpriseProduct) => {
    setActiveProduct(product);
    setIsShowCreateForm(true);
  };

  const closeCreateProductModalHandler = () => {
    setIsShowCreateForm(false);
    searchProductHandler();
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

      if (res.data.code > 0) {
        notification.success({
          message: 'X??a tha??nh c??ng',
          // description: 'D???? li????u s???n ph???m ???? b??? x??a',
        });
        const queries: IQuery = {
          businessId: enterpriseID,
        };

        if (enterprise.type === 1) {
          queries.exportProductDetail = keyword;
        } else {
          queries.importProductDetail = keyword;
        }

        dispatch(productAsyncActions.getListProducts(queries));
      } else {
        notification.error({
          message: 'Th??m s???n ph???m kh??ng th??nh c??ng',
          description: 'L???i h??? th???ng',
        });
      }

      hideDeleteProductHandler();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    const queries: IQuery = {
      businessId: enterpriseID,
    };

    if (enterprise.type === 1) {
      queries.exportProductDetail = queryParams.get(QUERY_KEYS.SEARCH) || undefined;
    } else {
      queries.importProductDetail = queryParams.get(QUERY_KEYS.SEARCH) || undefined;
    }

    dispatch(productAsyncActions.getListProducts(queries));

    return () => {
      setQueryParams(new URLSearchParams());
    };
  }, [enterpriseID]);

  useEffect(() => {
    if (!keyword) {
      queryParams.delete(QUERY_KEYS.SEARCH);
    } else {
      queryParams.set(QUERY_KEYS.SEARCH, keyword);
    }

    setQueryParams(queryParams);
  }, [keyword]);

  return (
    <main className="enterprise-product-list-page">
      <h1 className="page-title">Danh sa??ch s???n ph???m c???a doanh nghi????p</h1>
      <div>
        <h2>Th??ng tin doanh nghi???p</h2>
        <p>T??n doanh nghi???p: {enterprise.name} </p>
        <p>Lo???i h??nh doanh nghi???p: {EEnterpriseType[enterprise.type]}</p>
      </div>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Ti??m ki????m theo t??n s???n ph???m"
          value={keyword}
          enterButton
          onChange={updateSearchQueries}
          onSearch={searchProductHandler}
          onBlur={trimSearchKeywordHandler}
        />

        {userEnterpriseProductRole?.isInsert && (
          <Button className="page-navigate-link" onClick={showCreateFormHandler}>
            Th??m m????i
          </Button>
        )}
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
        enterpriseProductRole={userEnterpriseProductRole}
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
        <h3>B???n c?? ch???c ch???n mu???n x??a s???n ph???m?</h3>
        <p>M?? s???n ph???m {activeProduct?.productID} </p>
        <div className="btn-container">
          <Button className="btn btn--cancel" onClick={hideDeleteProductHandler} type="primary">
            H???y
          </Button>
          <Button
            className="btn btn--confirm"
            onClick={() => deleteProductHandler(activeProduct as IEnterpriseProduct)}
            type="primary"
            danger
          >
            ?????ng ??
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
