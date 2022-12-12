import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { contactAsyncActions } from '@/stores/contact.store';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactHistoriesList from './shared/ContactHistoriesList';

import './ContactHitories.less';
import { IContact, IEnterprise } from '@/interface/business';
import AddNewContact from './AddNewContact';
import { userHasRole } from '@/utils/hasRole';
import { ROLES_ID } from '@/constants/roles';
import { createContactHistory } from '@/api/business';
import EditContact from './EditContact';

interface IComponentProps {
  enterprise: IEnterprise;
}

export default function ContactHistoryList({ enterprise }: IComponentProps) {
  const enterpriseID = enterprise.id;

  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(state => state.user.role.data);
  const dataStatus = useAppSelector(state => state.contact.status);
  const contactList = useAppSelector(state => state.contact.data.contactHistories);

  const [queryParams, setQueryParams] = useSearchParams();
  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isShowCreateForm, setIsShowCreateForm] = useState(false);
  const [isShowDeleteForm, setIsShowDeleteForm] = useState(false);
  const [selectingContact, setSelectingContact] = useState<IContact | undefined>();

  const userEnterpriseRole = userHasRole(ROLES_ID.ENTERPRISE_MANAGEMENT, userRoles);

  const hideFormHandler = () => {
    setIsShowCreateForm(false);
    setIsShowDeleteForm(false);
    setIsShowEditForm(false);
  };

  const showCreateFormHandler = () => {
    setIsShowCreateForm(true);
  };

  const afterSaveDataHandler = () => {
    hideFormHandler();
    dispatch(contactAsyncActions.getContactListInfo({ enterpriseID: Number(enterpriseID) }));
  };

  const updateContactLogHandler = (contact: IContact) => {
    setSelectingContact(contact);
    setIsShowEditForm(true);
  };

  const deleteContactLogHandler = (contact: IContact) => {
    setSelectingContact(contact);
    setIsShowDeleteForm(true);
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

  const confirmDeleteContactHandler = async () => {
    const submitData = {
      logId: selectingContact!.logID,
      businessId: selectingContact!.businessID,
      content: selectingContact!.content,
      note: selectingContact!.note,
      status: 0,
    };

    try {
      const res = await createContactHistory(submitData);

      console.log('Result: ', res);
      notification.success({
        message: 'Xóa thành công',
      });
      afterSaveDataHandler();
    } catch (error) {
      console.log('Error: ', error);

      notification.success({
        message: 'Xóa không thành công',
      });
    }
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
      {/* <div>
        <p>Mã doanh nghiệp</p>
        <p>{enterprise?.id || '--'}</p>
      </div> */}
      <div>
        {/* <p>Tên doanh nghiệp</p> */}
        <h2>{enterprise?.name || '--'}</h2>
      </div>
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
        canDelete={!!userEnterpriseRole?.isDelete}
        canEdit={!!userEnterpriseRole?.isUpdate}
        data={contactList}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
          hideOnSinglePage: true,
        }}
        loading={dataStatus === 'loading'}
        onDeleteContact={deleteContactLogHandler}
        onEditContact={updateContactLogHandler}
      />

      <Modal
        visible={isShowCreateForm}
        onCancel={hideFormHandler}
        footer={null}
        width={window.innerWidth / 2}
        destroyOnClose
      >
        <AddNewContact enterprise={enterprise} onClose={afterSaveDataHandler} />
      </Modal>
      <Modal
        visible={isShowEditForm}
        onCancel={hideFormHandler}
        footer={null}
        width={window.innerWidth / 2}
        destroyOnClose
      >
        <EditContact contact={selectingContact} enterprise={enterprise} onClose={afterSaveDataHandler} />
      </Modal>
      <Modal
        className="delete-product-modal"
        visible={isShowDeleteForm}
        onCancel={hideFormHandler}
        footer={null}
        destroyOnClose
      >
        <h3>Bạn có chắc chắn muốn xóa lịch sử #{selectingContact?.logID}?</h3>
        <div className="btn-container">
          <Button className="btn btn--cancel" onClick={hideFormHandler} type="primary">
            Hủy
          </Button>
          <Button className="btn btn--confirm" onClick={confirmDeleteContactHandler} type="primary" danger>
            Đồng ý
          </Button>
        </div>
      </Modal>
    </main>
  );
}
