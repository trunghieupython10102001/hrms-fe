import { getContactList } from '@/api/business';
import { IContact, IEnterprise } from '@/interface/business';
import { mapAPIResponseToContactHistories } from '@/utils/mapContactHistoryAPI';
import { CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IContactHistorySlice {
  data: {
    contactHistories: IContact[];
    total: number;
    contactEnterprise?: IEnterprise;
  };
  status: 'init' | 'loading' | 'success' | 'error';
  error?: any;
}

const initialState: IContactHistorySlice = {
  data: {
    contactHistories: [],
    total: 0,
  },
  status: 'init',
  error: undefined,
};

const getContactListInfo = createAsyncThunk(
  'contacts/getContactListInfo',
  async (params?: { enterpriseID?: number; logId?: number }) => {
    try {
      const response = await getContactList(params && { businessId: params.enterpriseID, logId: params?.logId });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = response.data[0].map(mapAPIResponseToContactHistories);

      return [data, undefined];
    } catch (error) {
      return [undefined, error];
    }
  },
);

const _reset: CaseReducer<IContactHistorySlice> = state => {
  state.data.contactHistories = [];
  state.data.contactEnterprise = undefined;
  state.data.total = 0;
  state.error = undefined;
  state.status = 'init';
};

const _setEnterprise: CaseReducer<IContactHistorySlice, PayloadAction<IEnterprise>> = (state, action) => {
  state.data.contactEnterprise = action.payload;
};

const contactHistorySlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    reset: _reset,
    setEnterprise: _setEnterprise,
  },
  extraReducers(builder) {
    builder.addCase(getContactListInfo.pending, state => {
      state.status = 'loading';
      state.error = undefined;
    });
    builder.addCase(getContactListInfo.fulfilled, (state, action) => {
      const [data, error] = action.payload as [IContact[], any];

      if (error) {
        state.error = error;
        state.status = 'error';
      } else {
        state.data.contactHistories = data;
        state.data.total = data.length;
        state.status = 'success';
        state.error = undefined;
      }
    });
  },
});

export const contactActions = contactHistorySlice.actions;
export const contactAsyncActions = { getContactListInfo };
export default contactHistorySlice.reducer;
