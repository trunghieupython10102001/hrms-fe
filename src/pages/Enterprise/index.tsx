import ContactHistoryList from '@/components/ContactHistory/ContactHitories';
import EnterpriseProductsList from '@/components/EnterpriseProduct';
import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EnterpriseList from './shared/EnterpriseList';

import './index.less';

export default function EnterpriseListPage() {
  const data = useAppSelector(state => state.enterprise.data.enterprises);
  const dataStatus = useAppSelector(state => state.enterprise.status);
  const dispatch = useAppDispatch();

  const [queryParams, setQueryParams] = useSearchParams();
  const [isShowContactHistoryModal, setIsShowContactHistoryModal] = useState(false);
  const [isShowEnterpriseProductsModal, setIsShowEnterpriseProductsModal] = useState(false);
  const [activeEnterprise, setActiveEnterprise] = useState<IEnterprise | undefined>();

  const showEnterpriseContactHistoryHandler = (enterprise: IEnterprise) => {
    setActiveEnterprise(enterprise);
    setIsShowContactHistoryModal(true);
  };

  const showEnterpriseProductsHandler = (enterprise: IEnterprise) => {
    setActiveEnterprise(enterprise);
    setIsShowEnterpriseProductsModal(true);
  };

  const hideEnterpriseContactHistoryHandler = () => {
    setActiveEnterprise(undefined);
    setIsShowContactHistoryModal(false);
  };

  const hideEnterpriseProductListModal = () => {
    setActiveEnterprise(undefined);
    setIsShowEnterpriseProductsModal(false);
  };

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
  };

  useEffect(() => {
    if (data.length === 0) {
      dispatch(enterpriseAsyncActions.getEnterpriseList());
    }
  }, []);

  return (
    <main className="enterprise-list-page">
      <h1 className="page-title">Danh sách doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onSearch={onSearchUser}
          enterButton
        />
        <Link to="/doanh-nghiep/tao-moi" className="page-navigate-link">
          Thêm mới
        </Link>
      </div>
      <EnterpriseList
        data={data}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
        }}
        loading={dataStatus === 'loading'}
        onShowEnterpriseContactHistory={showEnterpriseContactHistoryHandler}
        onShowEnterPriseProducts={showEnterpriseProductsHandler}
      />
      <Modal
        visible={isShowContactHistoryModal}
        onCancel={hideEnterpriseContactHistoryHandler}
        footer={null}
        width={window.innerWidth / 2}
      >
        <ContactHistoryList enterprise={activeEnterprise as IEnterprise} />
      </Modal>

      <Modal
        visible={isShowEnterpriseProductsModal}
        onCancel={hideEnterpriseProductListModal}
        footer={null}
        width={window.innerWidth / 2}
      >
        <EnterpriseProductsList enterprise={activeEnterprise as IEnterprise} />
      </Modal>
    </main>
  );
}
