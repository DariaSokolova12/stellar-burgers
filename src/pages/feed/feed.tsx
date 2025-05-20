import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getAllOrders,
  loading
} from '../../services/slices/FeedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const Orders: TOrder[] = useSelector(getAllOrders);
  const isLoading: boolean = useSelector(loading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={Orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
