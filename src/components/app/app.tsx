import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  Feed,
  NotFound404
} from '@pages';

import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { OnlyUnauthRoute } from '../only-unauth-route/only-unauth-route';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const background = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <main>
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route
            path='/login'
            element={
              <OnlyUnauthRoute>
                <Login />
              </OnlyUnauthRoute>
            }
          />
          <Route
            path='/register'
            element={
              <OnlyUnauthRoute>
                <Register />
              </OnlyUnauthRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <OnlyUnauthRoute>
                <ForgotPassword />
              </OnlyUnauthRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <OnlyUnauthRoute>
                <ResetPassword />
              </OnlyUnauthRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={<div>Детали заказа из ленты (модалка)</div>}
          />
          <Route
            path='/ingredients/:id'
            element={<div>Детали ингредиента (модалка)</div>}
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <div>Детали заказа из профиля (модалка)</div>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={() => navigate('/')}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title='Информация о заказе'
                  onClose={() => navigate('/feed')}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal
                    title='Информация о заказе'
                    onClose={() => navigate('/profile/orders')}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;
