import { createOrUpdateBussinessArea } from '@/api/business';
import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { IBusinessArea } from '@/interface/businessArea';
import { bussinessAreaAsyncActions } from '@/stores/businessArea.store';
import { mapBussinessAreaToAPIRequest } from '@/utils/mapBussinessAreaAPIInfo';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import './index.less';
import BusinessAreaForm from './shared/BusinessAreaForm';
import BusinessAreaList from './shared/BusinessAreaList';

export default function BusinessAreas() {
  const businessAreas = useAppSelector(state => state.businessArea.data.bussinessAreas);
  const dataStatus = useAppSelector(state => state.businessArea.status);
  const dispatch = useAppDispatch();

  const [businessArea, setBusinessArea] = useState<IBusinessArea | true | undefined>();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [queryParams, setQueryParams] = useSearchParams();

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

  const onEditArea = (area: IBusinessArea) => {
    setBusinessArea(area);
  };

  const onCreateNewBusinessArea = () => {
    setBusinessArea(true);
  };

  const onCloseModal = () => {
    setBusinessArea(undefined);
  };

  const onSubmitFormHandler = async (form: IBusinessArea | { name: string }) => {
    setIsSubmittingForm(true);

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await createOrUpdateBussinessArea(mapBussinessAreaToAPIRequest(form));

      notification.success({ message: 'Tạo thành công', description: 'Lĩnh vực mới đã được lưu vào cơ sở dữ liệu' });
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    } catch (error) {
      notification.error({ message: 'Tạo thất bại', description: 'Lĩnh vực mới chưa được lưu vào cơ sở dữ liệu' });
    } finally {
      setIsSubmittingForm(false);
      setBusinessArea(undefined);
    }
  };

  useEffect(() => {
    if (businessAreas.length === 0) {
      dispatch(bussinessAreaAsyncActions.getBusinessAreaList());
    }
  }, []);

  useEffect(() => {
    const search = queryParams.get(QUERY_KEYS.SEARCH) || '';

    dispatch(bussinessAreaAsyncActions.getBusinessAreaList({ businessName: search }));
  }, [queryParams]);

  return (
    <main className="business-area-list-page">
      <h1 className="page-title">Lĩnh vực kinh doanh</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm theo tên lĩnh vực kinh doanh"
          onSearch={onSearchUser}
          suffix={
            <button className="clear-btn" onClick={onClearSearchHandler}>
              <CloseCircleOutlined />
            </button>
          }
          enterButton
        />
        <Button type="primary" onClick={onCreateNewBusinessArea}>
          Thêm lĩnh vực
        </Button>
      </div>
      <BusinessAreaList
        data={businessAreas}
        pagination={{ pageSize: 10, position: ['bottomCenter'], className: 'table-pagination' }}
        loading={dataStatus === 'loading'}
        onEditArea={onEditArea}
      />
      <Modal visible={!!businessArea} onCancel={onCloseModal} footer={false} destroyOnClose wrapClassName="modal">
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
    </main>
  );
}
