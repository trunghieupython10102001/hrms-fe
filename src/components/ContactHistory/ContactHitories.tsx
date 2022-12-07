import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { contactAsyncActions } from '@/stores/contact.store';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactHistoriesList from './shared/ContactHistoriesList';

import './ContactHitories.less';
import { IEnterprise } from '@/interface/business';
import AddNewContact from './AddNewContact';

interface IComponentProps {
  enterprise: IEnterprise;
}

export default function ContactHistoryList({ enterprise }: IComponentProps) {
  const enterpriseID = enterprise.id;
  const dispatch = useAppDispatch();
  const contactList = useAppSelector(state => state.contact.data.contactHistories);
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
    dispatch(contactAsyncActions.getContactListInfo({ enterpriseID: Number(enterpriseID) }));
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
    dispatch(contactAsyncActions.getContactListInfo({ enterpriseID: Number(enterpriseID) }));
  }, [enterpriseID]);

  useEffect(() => {
    const search = queryParams.get(QUERY_KEYS.SEARCH) || '';

    dispatch(contactAsyncActions.getContactListInfo({ enterpriseID: Number(enterpriseID), logId: Number(search) }));
  }, [enterpriseID, queryParams]);

  return (
    <main className="enterprise-contact-list-page">
      <h1 className="page-title">Danh sách lịch sử tiếp cận doanh nghiệp</h1>
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
      <ContactHistoriesList
        data={contactList}
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
        <AddNewContact enterprise={enterprise} onClose={afterSaveDataHandler} />
      </Modal>
    </main>
  );
}
