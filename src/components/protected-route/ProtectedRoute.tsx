import { useSelector } from '../../services/store';
import { userData, isAuthChecked } from '../../services/slices/UserSlice';
import { Preloader } from '@ui';

import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(userData);
  const authChecked = useSelector(isAuthChecked);
  const location = useLocation();

  if (!authChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
