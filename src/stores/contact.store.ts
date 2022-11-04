import { IContact, IEnterprise } from '@/interface/business';
import { sleep } from '@/utils/misc';
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

const getContactList = createAsyncThunk('contacts/getContactList', async (_enterpriseID: number) => {
  await sleep(1500);

  const mockData: IContact[] = [
    {
      businessID: 17,
      content: 'abdbadbadba',
      logID: 1,
      note: 'adbadab',
    },
    {
      logID: 2,
      businessID: 19,
      content: 'abdbadbadba',
      note: 'adbadab',
    },
  ];

  return [mockData, undefined];
});

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
    builder.addCase(getContactList.pending, state => {
      state.status = 'loading';
      state.error = undefined;
    });
    builder.addCase(getContactList.fulfilled, (state, action) => {
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
export const contactAsyncActions = { getContactList };
export default contactHistorySlice.reducer;
