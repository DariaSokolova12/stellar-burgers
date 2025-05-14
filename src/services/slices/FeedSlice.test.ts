import feedSlice, {
  fetchFeeds,
  getOrderByNumber,
  initialState
} from './FeedSlice';
import { TOrdersData, TOrder } from '@utils-types';

describe('feedSlice reducer', () => {
  it('handle fetchFeeds.pending action', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handle fetchFeeds.fulfilled action', () => {
    const testOrdersData: TOrdersData = {
      orders: [
        {
          _id: '911',
          status: 'done',
          name: 'testOrder',
          createdAt: '13.09.2024',
          updatedAt: '13.09.2024',
          number: 911,
          ingredients: ['id1', 'id2']
        }
      ],
      total: 1,
      totalToday: 1
    };
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: testOrdersData
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(testOrdersData);
  });

  it('handle fetchFeeds.rejected action', () => {
    const error = 'Failed to fetch feeds';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: error }
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('handle getOrderByNumber.pending action', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('handle getOrderByNumber.fulfilled action', () => {
    const testOrder: TOrder = {
      _id: '911',
      status: 'done',
      name: 'testOrder',
      createdAt: '13.09.2024',
      updatedAt: '13.09.2024',
      number: 911,
      ingredients: ['id1', 'id2']
    };
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [testOrder] }
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.modalOrder).toEqual(testOrder);
  });

  it('handle getOrderByNumber.rejected action', () => {
    const error = 'Failed to fetch order';
    const action = {
      type: getOrderByNumber.rejected.type,
      error: { message: error }
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});