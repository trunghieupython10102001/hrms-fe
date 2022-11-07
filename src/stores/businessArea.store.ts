import { IBusinessArea } from '@/interface/businessArea';
import { sleep } from '@/utils/misc';
import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IBusinessAreaSlice {
  data: {
    bussinessAreas: IBusinessArea[];
    total: number;
  };
  status: 'init' | 'loading' | 'success' | 'error';
  error?: any;
}

const initialState: IBusinessAreaSlice = {
  data: {
    bussinessAreas: [],
    total: 0,
  },
  status: 'init',
  error: undefined,
};

const getBusinessAreaList = createAsyncThunk('bussinessArea/getBusinessAreaList', async () => {
  await sleep(1500);

  const mockData: IBusinessArea[] = [
    {
      id: 1,
      name: 'Công ty xuất khẩu',
      createTime: '01/24/2001',
      updateTime: '01/24/2001',
    },
    {
      id: 2,
      name: 'Công ty nhập khẩu',
      createTime: '01/24/2001',
      updateTime: '01/24/2001',
    },
  ];

  return [mockData, undefined];
});

const _reset: CaseReducer<IBusinessAreaSlice> = state => {
  state.data.bussinessAreas = [];
  state.data.total = 0;
  state.error = undefined;
  state.status = 'init';
};

const bussinessAreaSlice = createSlice({
  name: 'bussinessArea',
  initialState,
  reducers: {
    reset: _reset,
  },
  extraReducers(builder) {
    builder.addCase(getBusinessAreaList.pending, state => {
      state.status = 'loading';
      state.error = undefined;
    });

    builder.addCase(getBusinessAreaList.fulfilled, (state, action) => {
      const [data, error] = action.payload as [IBusinessArea[], any];

      if (error) {
        state.error = error;
        state.status = 'error';
      } else {
        state.data.bussinessAreas = data;
        state.data.total = data.length;
        state.status = 'success';
        state.error = undefined;
      }
    });
  },
});

export const bussinessAreaActions = bussinessAreaSlice.actions;
export const bussinessAreaAsyncActions = {
  getBusinessAreaList,
};
export default bussinessAreaSlice.reducer;
