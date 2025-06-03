import feedReducer, { fetchFeeds, fetchUserOrders } from './feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '643d69a5c3f7b9001cfa093c',
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  };

  const mockFeedsResponse = {
    orders: [mockOrder],
    total: 1000,
    totalToday: 50
  };

  describe('fetchFeeds async action', () => {
    it('should set loading to true when fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set feed data and loading to false when fetchFeeds.fulfilled', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsResponse
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockFeedsResponse.orders);
      expect(state.total).toBe(mockFeedsResponse.total);
      expect(state.totalToday).toBe(mockFeedsResponse.totalToday);
      expect(state.error).toBeNull();
    });

    it('should set error and loading to false when fetchFeeds.rejected', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should use default error message when error message is not provided', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: {}
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ленты');
    });
  });

  describe('fetchUserOrders async action', () => {
    it('should set user orders when fetchUserOrders.fulfilled', () => {
      const userOrders = [mockOrder];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: userOrders
      };
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual(userOrders);
    });
  });

  describe('state transitions', () => {
    it('should clear error when starting new request after previous error', () => {
      const stateWithError = {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: 'Previous error'
      };

      const state = feedReducer(stateWithError, {
        type: fetchFeeds.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should preserve existing data when loading new data', () => {
      const stateWithData = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10,
        loading: false,
        error: null
      };

      const state = feedReducer(stateWithData, {
        type: fetchFeeds.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.orders).toEqual([mockOrder]);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });
});
