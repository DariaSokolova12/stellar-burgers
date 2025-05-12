import { FC } from 'react';
import { useLocation , Navigate} from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/UserSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    <Navigate replace to='/login' />;
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
