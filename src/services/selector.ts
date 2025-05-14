import { RootState } from './store';

export const findOrderByNumber = (number: number) => (state: RootState) => {
  if (state.feed.data.orders.length || state.user.orders.length) {
    return (
      state.feed.data.orders.find((order) => order.number === number) ||
      state.user.orders.find((order) => order.number === number)
    );
  }
  if (state.feed.modalOrder) {
    return state.feed.modalOrder.number === number
      ? state.feed.modalOrder
      : null;
  }
  return null;
};
