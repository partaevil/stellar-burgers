import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { LoginUI } from '@ui-pages';
import { setUser, setAuthenticated } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    dispatch(setUser(null));
    dispatch(setAuthenticated(false));

    loginUserApi({ email, password })
      .then((data) => {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        dispatch(setUser(data.user));
        dispatch(setAuthenticated(true));

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Ошибка входа');
        dispatch(setAuthenticated(false));
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
