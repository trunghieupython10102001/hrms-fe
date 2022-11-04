import { QUERY_KEYS } from '@/constants/keys';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { contactAsyncActions } from '@/stores/contact.store';
import { Input } from 'antd';
import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ContactHistoriesList from './shared/ContactHistoriesList';

export default function ContactHistoryListPage() {
  const params = useParams();
  const enterpriseID = params.enterpriseID;
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

  useEffect(() => {
    if (contactList.length === 0) {
      dispatch(contactAsyncActions.getContactList(Number(enterpriseID)));
    }
  }, []);

  return (
    <main className="enterprise-list-page">
      <h1 className="page-title">Danh sách lịch sử tiếp cận doanh nghiệp</h1>
      <div className="page-action-main">
        <Input.Search
          className="page-search-box"
          placeholder="Tìm kiếm doanh nghiệp theo tên"
          onSearch={onSearchUser}
          enterButton
        />
        <Link to="/lich-su-tiep-can/tao-moi" className="page-navigate-link">
          Thêm mới
        </Link>
      </div>
      <ContactHistoriesList data={contactList} pagination={false} loading={dataStatus === 'loading'} />
    </main>
  );
}
