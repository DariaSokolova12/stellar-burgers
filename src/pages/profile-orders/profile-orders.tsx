import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC ,useEffect} from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  loading,
  userOrders,
  getUserOrders
} from '../../services/slices/UserSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
    const dispatch = useDispatch();
  const isLoading = useSelector(loading);
  const orders: TOrder[] = useSelector(userOrders);
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
