import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { contactAsyncActions } from '@/stores/contact.store';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ContactHistoriesList from './shared/ContactHistoriesList';

import './ContactHitories.less';
import { IEnterprise } from '@/interface/business';

interface IComponentProps {
  enterprise: IEnterprise;
}

export default function ContactHistoryList({ enterprise }: IComponentProps) {
  const enterpriseID = enterprise.id;
  const dispatch = useAppDispatch();
  const contactList = useAppSelector(state => state.contact.data.contactHistories);
  const dataStatus = useAppSelector(state => state.contact.status);
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
        <Link to={`/lich-su-tiep-can/tao-moi?enterprise=${enterpriseID}`} className="page-navigate-link">
          Thêm mới
        </Link>
      </div>
      <ContactHistoriesList
        data={contactList}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          className: 'table-pagination',
        }}
        loading={dataStatus === 'loading'}
      />
    </main>
  );
}
