import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrdersData, TOrder } from '@utils-types';

interface FeedSliceState {
  data: TOrdersData;
  modalOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialState: FeedSliceState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  modalOrder: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.modalOrder = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch order by number error';
      });
  },
  selectors: {
    getAllOrders: (state) => state.data.orders,
    getTotal: (state) => state.data.total,
    getTotalToday: (state) => state.data.totalToday,
    loading: (state) => state.loading
  }
});

export default feedSlice;
export const { getAllOrders, getTotal, getTotalToday, loading } =
  feedSlice.selectors;
