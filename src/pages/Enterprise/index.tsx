import ContactHistoryList from '@/components/ContactHistory/ContactHitories';
import EnterpriseProductsList from '@/components/EnterpriseProduct';
import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise } from '@/interface/business';
import { enterpriseActions, enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Input, Modal } from 'antd';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import _union from 'lodash/union';
import _difference from 'lodash/difference';
import { Link, useSearchParams } from 'react-router-dom';
import EnterpriseList from './shared/EnterpriseList';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
import _debounce from 'lodash/debounce';

import './index.less';
import { UploadFileButton } from '@/components/UploadFile';

export default function EnterpriseListPage() {
  const data = useAppSelector(state => state.enterprise.data.enterprises);
  const dataStatus = useAppSelector(state => state.enterprise.status);
  const dispatch = useAppDispatch();

  const userRoles = useAppSelector(state => state.user.role.data);
  const userEnterpriseRole = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);
  const userContactLogRole = userHasRole(ROLES_ID.CONTACT_LOG_MANAGEMENT, userRoles);
  const userEnterpriseProductRole = userHasRole(ROLES_ID.ENTERPRISE_PRODUCT_MANAGEMENT, userRoles);

  const [queryParams, setQueryParams] = useSearchParams();

  const [isShowContactHistoryModal, setIsShowContactHistoryModal] = useState(false);
  const [isShowEnterpriseProductsModal, setIsShowEnterpriseProductsModal] = useState(false);
  const [activeEnterprise, setActiveEnterprise] = useState<IEnterprise | undefined>();
  const [keyword, setKeyword] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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

  const deferedSearch = useMemo(() => {
    return _debounce((searchValue: string) => {
      dispatch(enterpriseAsyncActions.getEnterpriseList({ businessName: searchValue || undefined }));
    }, 500);
  }, [dispatch]);

  const searchEnterpriseHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.trim();

    setKeyword(searchValue);

    dispatch(enterpriseActions.setFetchingStatus('loading'));

    deferedSearch(searchValue);
  };

  const choosedFileHandler = (file: File) => {
    console.log('File:', file);
  };

  const selectRowsHandler = (keys: number[], isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(rowKeys => _union(rowKeys, keys));
    } else {
      setSelectedRows(rowKeys => _difference(rowKeys, keys));
    }
  };

  const exportSelectedRowToExcel = async () => {
    console.log('Selected records: ', selectedRows);
    if (selectedRows.length === 0) {
      return { link: '', errorMgs: 'Bạn chưa chọn bản ghi nào' };
      // return { link: '', errorMgs: 'Có lỗi xảy ra, không thể lấy dữ liệu từ máy chủ' };
    }
    setSelectedRows([]);

    return { link: '', errorMgs: '' };
  };

  useEffect(() => {
    if (data.length === 0 && (dataStatus === 'init' || dataStatus === 'error')) {
      dispatch(enterpriseAsyncActions.getEnterpriseList({ businessName: keyword || undefined }));
    }
  }, []);

  useEffect(() => {
    const searchKeywork = queryParams.get(QUERY_KEYS.SEARCH) || '';

    setKeyword(searchKeywork);
  }, []);

  useEffect(() => {
    if (keyword === '') {
      queryParams.delete(QUERY_KEYS.SEARCH);
    } else {
      queryParams.set(QUERY_KEYS.SEARCH, keyword);
    }

    setQueryParams(queryParams);
  }, [keyword]);

  return (
    <main className="enterprise-list-page">
      <h1 className="page-title">Danh sách doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onChange={searchEnterpriseHandler}
          value={keyword}
          enterButton
        />
        {userEnterpriseRole?.isInsert && (
          <Link to="/doanh-nghiep/tao-moi" className="page-navigate-link">
            Thêm mới
          </Link>
        )}
        {userEnterpriseRole?.isInsert && (
          <UploadFileButton
            onExportToExcelFile={exportSelectedRowToExcel}
            onChooseFile={choosedFileHandler}
            className="import-excel-file-btn"
          >
            Nhập file excel
          </UploadFileButton>
        )}
      </div>
      <EnterpriseList
        data={data}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
        }}
        contactLogRole={userContactLogRole}
        enterpriseProductRole={userEnterpriseProductRole}
        loading={dataStatus === 'loading'}
        selectedRows={selectedRows}
        onSelectRows={selectRowsHandler}
        onShowEnterpriseContactHistory={showEnterpriseContactHistoryHandler}
        onShowEnterPriseProducts={showEnterpriseProductsHandler}
      />
      <Modal
        visible={isShowContactHistoryModal}
        onCancel={hideEnterpriseContactHistoryHandler}
        footer={null}
        width={window.innerWidth / 2}
        destroyOnClose
      >
        <ContactHistoryList enterprise={activeEnterprise as IEnterprise} />
      </Modal>

      <Modal
        visible={isShowEnterpriseProductsModal}
        onCancel={hideEnterpriseProductListModal}
        footer={null}
        width={window.innerWidth / 1.5}
        bodyStyle={{
          padding: '1rem 3rem',
        }}
        destroyOnClose
      >
        <EnterpriseProductsList enterprise={activeEnterprise as IEnterprise} />
      </Modal>
    </main>
  );
}
