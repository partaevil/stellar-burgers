import userReducer, {
  initialState,
  getUser,
  setAuthChecked,
  clearUserErrors,
  setUser,
  setAuthenticated
} from './userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('getUser async action', () => {
    it('should set user data, authentication status and authChecked when getUser.fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should set authChecked to true when getUser.rejected', () => {
      const action = { type: getUser.rejected.type };
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('synchronous actions', () => {
    it('should set authChecked status when setAuthChecked is called', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('should clear user errors when clearUserErrors is called', () => {
      const stateWithErrors = {
        ...initialState,
        loginUserError: 'Login error',
        registerUserError: 'Register error'
      };

      const action = clearUserErrors();
      const state = userReducer(stateWithErrors, action);

      expect(state.loginUserError).toBeNull();
      expect(state.registerUserError).toBeNull();
    });

    it('should set user when setUser is called', () => {
      const action = setUser(mockUser);
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('should clear user when setUser is called with null', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };

      const action = setUser(null);
      const state = userReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });

    it('should set authentication status when setAuthenticated is called', () => {
      const action = setAuthenticated(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('state transitions', () => {
    it('should maintain other state properties when updating user', () => {
      const stateWithData = {
        ...initialState,
        loginUserError: 'Some error',
        registerUserRequest: true
      };

      const action = setUser(mockUser);
      const state = userReducer(stateWithData, action);

      expect(state.user).toEqual(mockUser);
      expect(state.loginUserError).toBe('Some error');
      expect(state.registerUserRequest).toBe(true);
    });

    it('should handle authentication flow correctly', () => {
      let state = userReducer(initialState, setAuthChecked(false));
      expect(state.isAuthChecked).toBe(false);

      state = userReducer(state, {
        type: getUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
