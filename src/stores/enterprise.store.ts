import { IEnterprise } from '@/interface/business';
import { sleep } from '@/utils/misc';
import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IEnterpriseSlice {
  data: {
    enterprises: IEnterprise[];
    total: number;
  };
  status: 'init' | 'loading' | 'success' | 'error';
  error?: any;
}

const initialState: IEnterpriseSlice = {
  data: {
    enterprises: [],
    total: 0,
  },
  status: 'init',
  error: undefined,
};

const getEnterpriseList = createAsyncThunk('enterprise/getEnterpriseList', async () => {
  await sleep(1500);

  const mockData: IEnterprise[] = [
    {
      id: 1,
      email: 'a@a.a',
      name: 'abc',
      phone: '0123456789',
      status: 0,
      type: 1,
      address: 'Sơn Tây, Hà Nội',
      areaID: 1,
      contactDetail: 'thị xẫ Sơn Tây, thành phố Hà Nội',
      contactedTimes: 1,
      country: 'Việt Nam',
      createTime: '24/01/2001',
      createUser: '',
      note: '',
      updateTime: '24/01/2001',
      updateUser: '',
    },
    {
      id: 2,
      email: 'a@a.a',
      name: 'Hoangzzzsss',
      phone: '0123456739',
      status: 1,
      type: 2,
      address: '',
      areaID: 2,
      contactDetail: '',
      contactedTimes: 1,
      country: '',
      createTime: ' ',
      createUser: '',
      note: '',
      updateTime: '',
      updateUser: '',
    },
  ];

  return [mockData, undefined];
});

const _reset: CaseReducer<IEnterpriseSlice> = state => {
  state.data.enterprises = [];
  state.data.total = 0;
  state.error = undefined;
  state.status = 'init';
};

const enterpriseSlice = createSlice({
  name: 'enterprise',
  initialState,
  reducers: {
    reset: _reset,
  },
  extraReducers(builder) {
    builder.addCase(getEnterpriseList.pending, state => {
      state.status = 'loading';
      state.error = undefined;
    });

    builder.addCase(getEnterpriseList.fulfilled, (state, action) => {
      const [data, error] = action.payload as [IEnterprise[], any];

      if (error) {
        state.error = error;
        state.status = 'error';
      } else {
        state.data.enterprises = data;
        state.data.total = data.length;
        state.status = 'success';
        state.error = undefined;
      }
    });
  },
});

export const enterpriseActions = enterpriseSlice.actions;
export const enterpriseAsyncActions = { getEnterpriseList };
export default enterpriseSlice.reducer;
