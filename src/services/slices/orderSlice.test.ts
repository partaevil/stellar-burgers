import orderReducer, {
  initialState,
  createOrder,
  fetchOrderByNumber,
  clearOrder,
  setOrderModalData,
  clearOrderModalData
} from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '643d69a5c3f7b9001cfa093c',
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  };

  describe('createOrder async action', () => {
    it('should set orderRequest to true when createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set order data and orderRequest to false when createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('should set error and orderRequest to false when createOrder.rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should use default error message when error message is not provided', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
    });
  });

  describe('fetchOrderByNumber async action', () => {
    it('should set orderRequest to true when fetchOrderByNumber.pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });

    it('should set orderModalData and orderRequest to false when fetchOrderByNumber.fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('should set error and orderRequest to false when fetchOrderByNumber.rejected', () => {
      const errorMessage = 'Failed to fetch order';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should use default error message when error message is not provided', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: {}
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказа');
    });
  });

  describe('synchronous actions', () => {
    it('should clear all order data when clearOrder is called', () => {
      const stateWithData = {
        order: mockOrder,
        orderRequest: false,
        orderModalData: mockOrder,
        error: 'Some error'
      };

      const action = clearOrder();
      const state = orderReducer(stateWithData, action);

      expect(state.order).toBeNull();
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
      expect(state.orderRequest).toBe(false);
    });

    it('should set orderModalData when setOrderModalData is called', () => {
      const action = setOrderModalData(mockOrder);
      const state = orderReducer(initialState, action);

      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('should clear orderModalData when clearOrderModalData is called', () => {
      const stateWithModalData = {
        ...initialState,
        orderModalData: mockOrder
      };

      const action = clearOrderModalData();
      const state = orderReducer(stateWithModalData, action);

      expect(state.orderModalData).toBeNull();
    });
  });
});
