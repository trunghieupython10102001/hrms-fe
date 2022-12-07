import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProductsList } from '@/api/business';
import { mapAPIProductResponseToProductInfo } from '@/utils/mapEnterpriseProductInfoAPI';
import { IEnterpriseProduct } from '@/interface/business';

interface IEnterpriseProductSlice {
  data: {
    products: any[];
    total: number;
  };
  status: 'init' | 'loading' | 'success' | 'error';
  error?: any;
}

const getListProducts = createAsyncThunk('contacts/getProductsList', async (params?: { businessId?: number }) => {
  try {
    const response = await getProductsList(params);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = response.data[0].map(mapAPIProductResponseToProductInfo);

    return [data, undefined];
  } catch (error) {
    return [undefined, error];
  }
});

const initialState: IEnterpriseProductSlice = {
  data: {
    products: [],
    total: 0,
  },
  status: 'init',
  error: undefined,
};

const enterpriseProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getListProducts.pending, state => {
      state.status = 'loading';
      state.error = undefined;
    });
    builder.addCase(getListProducts.fulfilled, (state, action) => {
      const [data, error] = action.payload as [IEnterpriseProduct[], any];

      if (error) {
        state.error = error;
        state.status = 'error';
      } else {
        state.data.products = data;
        state.data.total = data.length;
        state.status = 'success';
        state.error = undefined;
      }
    });
  },
});

export const productActions = enterpriseProductSlice.actions;
export const productAsyncActions = { getListProducts };
export default enterpriseProductSlice.reducer;
