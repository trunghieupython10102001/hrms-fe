import { createOrUpdateBussinessArea } from '@/api/business';
import { QUERY_KEYS } from '@/constants/keys';
import { ROLES_ID } from '@/constants/roles';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IBusinessArea } from '@/interface/businessArea';
import { bussinessAreaActions, bussinessAreaAsyncActions } from '@/stores/businessArea.store';
import { userHasRole } from '@/utils/hasRole';
import { mapBussinessAreaToAPIRequest } from '@/utils/mapBussinessAreaAPIInfo';
import { Button, Input, Modal, notification } from 'antd';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import './index.less';
import BusinessAreaForm from './shared/BusinessAreaForm';
import BusinessAreaList from './shared/BusinessAreaList';
import _debounce from 'lodash/debounce';

export default function BusinessAreas() {
  const businessAreas = useAppSelector(state => state.businessArea.data.bussinessAreas);
  const dataStatus = useAppSelector(state => state.businessArea.status);
  const dispatch = useAppDispatch();

  const [businessArea, setBusinessArea] = useState<IBusinessArea | true | undefined>();
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [keyword, setKeyword] = useState('');

  const userRoles = useAppSelector(state => state.user.role.data);
  const userCategoriesRoles = userHasRole(ROLES_ID.CATEGORIES_MANAGEMENT, userRoles);

  const [queryParams, setQueryParams] = useSearchParams();

  const deferedSearch = useMemo(() => {
    return _debounce((searchValue: string) => {
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList({ businessAreaName: searchValue || undefined }));
    }, 500);
  }, [dispatch]);

  const searchEnterpriseHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.trim();

    setKeyword(searchValue);

    dispatch(bussinessAreaActions.setFetchingStatus('loading'));

    deferedSearch(searchValue);
  };

  const onSearchUser = (searchValue: string) => {
    if (searchValue.trim() === '') {
      return;
    }

    queryParams.set(QUERY_KEYS.SEARCH, searchValue.trim());
    setQueryParams(queryParams);
  };

  const onEditArea = (area: IBusinessArea) => {
    setBusinessArea(area);
    setIsShowEditModal(true);
  };

  const onCreateNewBusinessArea = () => {
    setIsShowEditModal(true);
    setBusinessArea(true);
  };

  const onDeleteArea = (area: IBusinessArea) => {
    setBusinessArea(area);
    setIsShowDeleteModal(true);
  };

  const onCloseModal = () => {
    setBusinessArea(undefined);
    setIsShowEditModal(false);
    setIsShowDeleteModal(false);
  };

  const onSubmitFormHandler = async (form: IBusinessArea | { name: string }) => {
    setIsSubmittingForm(true);

    try {
      await createOrUpdateBussinessArea(mapBussinessAreaToAPIRequest(form as IBusinessArea));

      notification.success({ message: 'Tạo thành công', description: 'Lĩnh vực mới đã được lưu vào cơ sở dữ liệu' });
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    } catch (error) {
      notification.error({ message: 'Tạo thất bại', description: 'Lĩnh vực mới chưa được lưu vào cơ sở dữ liệu' });
    } finally {
      setIsSubmittingForm(false);
      onCloseModal();
    }
  };

  const deleteBusinessAreaHandler = async () => {
    setIsSubmittingForm(true);

    try {
      const res = await createOrUpdateBussinessArea(mapBussinessAreaToAPIRequest(businessArea as IBusinessArea, true));

      console.log('Result: ', res);

      notification.success({ message: 'Xóa thành công' });
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    } catch (error) {
      notification.error({ message: 'Xóa không thành công' });
    } finally {
      setIsSubmittingForm(false);
      onCloseModal();
    }
  };

  useEffect(() => {
    if (businessAreas.length === 0 && (dataStatus === 'init' || dataStatus === 'error')) {
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList({ businessAreaName: keyword || undefined }));
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
    <main className="business-area-list-page">
      <h1 className="page-title">Lĩnh vực kinh doanh</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm theo tên lĩnh vực kinh doanh"
          enterButton
          value={keyword}
          onSearch={onSearchUser}
          onChange={searchEnterpriseHandler}
        />
        {userCategoriesRoles?.isInsert && (
          <Button type="primary" onClick={onCreateNewBusinessArea}>
            Thêm lĩnh vực
          </Button>
        )}
      </div>
      <BusinessAreaList
        canEdit={!!userCategoriesRoles?.isUpdate}
        canDeleteCategory={!!userCategoriesRoles?.isDelete}
        data={businessAreas}
        pagination={{ pageSize: 10, position: ['bottomCenter'], className: 'table-pagination' }}
        loading={dataStatus === 'loading'}
        onEditArea={onEditArea}
        onDeleteArea={onDeleteArea}
      />
      <Modal visible={isShowEditModal} onCancel={onCloseModal} footer={false} destroyOnClose wrapClassName="modal">
        <h3 className="title">
          {businessArea === true ? 'Tạo mới lĩnh vực kinh doanh' : 'Chỉnh sửa lĩnh vực kinh doanh'}
        </h3>
        <BusinessAreaForm
          onSubmit={onSubmitFormHandler}
          data={businessArea}
          isEditable
          isSubmitting={isSubmittingForm}
        />
      </Modal>
      <Modal
        className="delete-product-modal"
        visible={isShowDeleteModal}
        onCancel={onCloseModal}
        footer={null}
        destroyOnClose
      >
        <h3>Bạn có chắc chắn muốn xóa lĩnh vực {(businessArea as IBusinessArea)?.name}?</h3>
        <div className="btn-container">
          <Button className="btn btn--cancel" onClick={onCloseModal} type="primary">
            Hủy
          </Button>
          <Button className="btn btn--confirm" onClick={deleteBusinessAreaHandler} type="primary" danger>
            Đồng ý
          </Button>
        </div>
      </Modal>
    </main>
  );
}
