import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { contactAsyncActions } from '@/stores/contact.store';
import { Button, DatePicker, Modal, notification } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

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
import _debounce from 'lodash/debounce';
import { QUERY_KEYS } from '@/constants/keys';

const DATE_FORMAT = 'DD/MM/YYYY';

interface IComponentProps {
  enterprise: IEnterprise;
}

export default function ContactHistoryList({ enterprise }: IComponentProps) {
  const enterpriseID = enterprise.id;

  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(state => state.user.role.data);
  const dataStatus = useAppSelector(state => state.contact.status);
  const contactList = useAppSelector(state => state.contact.data.contactHistories);

  const userContactLogRole = userHasRole(ROLES_ID.CONTACT_LOG_MANAGEMENT, userRoles);

  const [queryParams, setQueryParams] = useSearchParams();

  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isShowCreateForm, setIsShowCreateForm] = useState(false);
  const [isShowDeleteForm, setIsShowDeleteForm] = useState(false);
  const [selectingContact, setSelectingContact] = useState<IContact | undefined>();
  const [filterRange, setFilterRange] = useState<RangePickerProps['value']>(undefined);

  const choseDateRangeHandler = (dates: RangePickerProps['value'], _dateStrings: [string, string]) => {
    const queries: { enterpriseID?: number; fromDate?: string; toDate?: string } = {
      enterpriseID: Number(enterpriseID),
    };

    if (dates) {
      queries.fromDate = dates[0]?.toISOString();
      queries.toDate = dates[1]?.toISOString();
    }

    dispatch(contactAsyncActions.getContactListInfo(queries));
    setFilterRange(dates);
  };

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

  const confirmDeleteContactHandler = async () => {
    const submitData = {
      logId: selectingContact!.logID,
      businessId: selectingContact!.businessID,
      content: selectingContact!.content,
      note: selectingContact!.note,
      status: 0,
    };

    try {
      const _res = await createContactHistory(submitData);

      // console.log('Result: ', res);
      notification.success({
        message: 'Xóa thành công',
      });
      afterSaveDataHandler();
    } catch (error) {
      // console.log('Error: ', error);

      notification.success({
        message: 'Xóa không thành công',
      });
    }
  };

  useEffect(() => {
    dispatch(
      contactAsyncActions.getContactListInfo({
        enterpriseID: Number(enterpriseID),
        fromDate: queryParams.get(QUERY_KEYS.FROM) || undefined,
        toDate: queryParams.get(QUERY_KEYS.TO) || undefined,
      }),
    );

    return () => {
      setQueryParams(new URLSearchParams());
    };
  }, [enterpriseID]);

  useEffect(() => {
    if (!filterRange) {
      queryParams.delete(QUERY_KEYS.FROM);
      queryParams.delete(QUERY_KEYS.TO);
    } else {
      queryParams.set(QUERY_KEYS.FROM, filterRange[0]?.format(DATE_FORMAT) || '');
      queryParams.set(QUERY_KEYS.TO, filterRange[1]?.format(DATE_FORMAT) || '');
    }
    setQueryParams(queryParams);
  }, [filterRange]);

  return (
    <main className="enterprise-contact-list-page">
      <h1 className="page-title">Danh sách lịch sử tiếp cận doanh nghiệp</h1>
      <div>
        <h2>{enterprise?.name || '--'}</h2>
      </div>
      <div className="page-action-main">
        <p>Khoảng ngày</p>
        <DatePicker.RangePicker
          value={filterRange}
          placeholder={['Từ ngày', 'Đến ngày']}
          format={DATE_FORMAT}
          onChange={choseDateRangeHandler}
        />

        {!!userContactLogRole?.isInsert && (
          <Button className="page-navigate-link" onClick={showCreateFormHandler}>
            Thêm mới
          </Button>
        )}
      </div>
      <ContactHistoriesList
        canDelete={!!userContactLogRole?.isDelete}
        canEdit={!!userContactLogRole?.isUpdate}
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
