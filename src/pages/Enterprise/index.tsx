import ContactHistoryList from '@/components/ContactHistory/ContactHitories';
import EnterpriseProductsList from '@/components/EnterpriseProduct';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IEnterprise, IEnterpriseFilterForm } from '@/interface/business';
import { enterpriseAsyncActions } from '@/stores/enterprise.store';
import { Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import _union from 'lodash/union';
import _difference from 'lodash/difference';
import { Link, useSearchParams } from 'react-router-dom';
import EnterpriseList from './shared/EnterpriseList';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
import _debounce from 'lodash/debounce';

import './index.less';
import { UploadFileButton } from '@/components/UploadFile';
import { exportEnterpriseDataToExcel } from '@/api/business';
import EnterpriseFilter from './shared/FIlter';

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
  // const [keyword, setKeyword] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [filter, setFilter] = useState<IEnterpriseFilterForm>({
    enterpriseArea: undefined,
    enterpriseEmail: '',
    enterpriseName: '',
    enterprisePhone: '',
    enterpriseType: undefined,
  });

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

  const filterEnterpriseHandler = (form: IEnterpriseFilterForm) => {
    console.log('Filter form 2: ', form);
    const { enterpriseArea, enterpriseEmail, enterpriseName, enterprisePhone, enterpriseType } = form;

    if (enterpriseName) {
      queryParams.set('enterpriseName', enterpriseName);
    } else {
      queryParams.delete('enterpriseName');
    }

    if (enterpriseArea) {
      queryParams.set('enterpriseArea', String(enterpriseArea));
    } else {
      queryParams.delete('enterpriseArea');
    }

    if (enterpriseEmail) {
      queryParams.set('enterpriseEmail', enterpriseEmail);
    } else {
      queryParams.delete('enterpriseEmail');
    }

    if (enterprisePhone) {
      queryParams.set('enterprisePhone', enterprisePhone);
    } else {
      queryParams.delete('enterprisePhone');
    }

    if (enterpriseType) {
      queryParams.set('enterpriseType', String(enterpriseType));
    } else {
      queryParams.delete('enterpriseType');
    }

    const queries = {
      businessEmail: enterpriseEmail || undefined,
      businessName: enterpriseName || undefined,
      businessPhone: enterprisePhone || undefined,
      businessAreaId: Number(enterpriseArea) || undefined,
      businessType: Number(enterpriseType) || undefined,
    };

    dispatch(enterpriseAsyncActions.getEnterpriseList(queries));

    setQueryParams(queryParams);
  };

  const clearFilter = () => {
    setFilter({
      enterpriseArea: undefined,
      enterpriseEmail: '',
      enterpriseName: '',
      enterprisePhone: '',
      enterpriseType: undefined,
    });

    setQueryParams(new URLSearchParams());
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

    try {
      const response = await exportEnterpriseDataToExcel(selectedRows.join(','));

      console.log('Export response: ', response);
      setSelectedRows([]);

      return { link: response.data, errorMgs: '' };
    } catch (error) {
      return { link: '', errorMgs: 'Có lỗi xảy ra, không thể xuất dữ liệu ra file excel' };
    }
  };

  useEffect(() => {
    if (dataStatus === 'init' || dataStatus === 'error') {
      const enterpriseName = queryParams.get('enterpriseName') || undefined;
      const enterpriseEmail = queryParams.get('enterpriseEmail') || undefined;
      const enterprisePhone = queryParams.get('enterprisePhone') || undefined;
      const enterpriseType = queryParams.get('enterpriseType') || undefined;
      const enterpriseArea = queryParams.get('enterpriseArea') || undefined;

      const queries: IEnterpriseFilterForm = {
        enterpriseEmail: enterpriseEmail || undefined,
        enterpriseName: enterpriseName || undefined,
        enterprisePhone: enterprisePhone || undefined,
        enterpriseArea: Number(enterpriseArea) || undefined,
        enterpriseType: Number(enterpriseType) || undefined,
      };

      setFilter(queries);

      dispatch(enterpriseAsyncActions.getEnterpriseList(queries));
    }
  }, []);

  // useEffect(() => {
  //   const searchKeywork = queryParams.get(QUERY_KEYS.SEARCH) || '';

  //   setKeyword(searchKeywork);
  // }, []);

  // useEffect(() => {
  //   if (keyword === '') {
  //     queryParams.delete(QUERY_KEYS.SEARCH);
  //   } else {
  //     queryParams.set(QUERY_KEYS.SEARCH, keyword);
  //   }

  //   setQueryParams(queryParams);
  // }, [keyword]);

  return (
    <main className="enterprise-list-page">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Danh sách doanh nghiệp</h1>
        {userEnterpriseRole?.isInsert && (
          <Space>
            <Link to="/doanh-nghiep/tao-moi" className="page-navigate-link">
              Thêm mới
            </Link>
            <UploadFileButton
              onExportToExcelFile={exportSelectedRowToExcel}
              onChooseFile={choosedFileHandler}
              className="import-excel-file-btn"
            />
          </Space>
        )}
      </div>
      <EnterpriseFilter filter={filter} onFilter={filterEnterpriseHandler} onClearFilter={clearFilter} />
      {/* <div className="page-action-main">
        
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onChange={searchEnterpriseHandler}
          value={keyword}
          enterButton
        />
      </div> */}
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
