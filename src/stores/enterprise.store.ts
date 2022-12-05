import { IEnterprise } from '@/interface/business';
import { getEnterprises } from '@/api/business';
import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mapEnterpriseAPIResponseToEnterprise } from '@/utils/mapEnterpriseAPIResponseToEnterprise';

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
  try {
    const res = await getEnterprises();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [res.data.map(mapEnterpriseAPIResponseToEnterprise), undefined];
  } catch (error) {
    return [undefined, error];
  }
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
        state.data.enterprises = [];
        state.data.total = 0;
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
