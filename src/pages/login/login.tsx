import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '../../components/ui/pages/login';
import { Navigate } from 'react-router-dom';
import {
  loginUser,
  responseError,
  isAuthenticated
} from '../../services/slices/UserSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(isAuthenticated);
  const errorMessage = useSelector(responseError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  if (authenticated) {
    return <Navigate to={'/'} />;
  }
  return (
    <LoginUI
      errorText={errorMessage || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      password={password}
      setPassword={setPassword}
    />
  );
};
