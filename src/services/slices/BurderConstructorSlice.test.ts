import burgerConstructorSlice, {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  initialState,
  BurgerConstructorSliceState,
  createOrder
} from './BurgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { TNewOrderResponse } from '../../utils/burger-api';

const testIngredientMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};
const testConstructorIngredientMain: TConstructorIngredient = {
  ...testIngredientMain,
  id: testIngredientMain._id
};
const testConstructorIngredientSauce: TConstructorIngredient = {
  id: '643d69a5c3f7b9001cfa0942',
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('burgerConstructorSlice reducer', () => {
  it('should handle addIngredient action', () => {
    const action = addIngredient(testIngredientMain);
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.constructorItems.ingredients).toEqual([
      expect.objectContaining(testIngredientMain)
    ]);
  });

  it('should handle removeIngredient action', () => {
    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [testConstructorIngredientMain]
      }
    };
    const action = removeIngredient(testConstructorIngredientMain);
    const state = burgerConstructorSlice.reducer(stateWithIngredient, action);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('should handle moveUpIngredient action', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          testConstructorIngredientMain,
          testConstructorIngredientSauce
        ]
      }
    };
    const action = moveUpIngredient(1);
    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients).toEqual([
      testConstructorIngredientSauce,
      testConstructorIngredientMain
    ]);
  });

  it('should handle moveDownIngredient action', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          testConstructorIngredientSauce,
          testConstructorIngredientMain
        ]
      }
    };
    const action = moveDownIngredient(0);
    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients).toEqual([
      testConstructorIngredientMain,
      testConstructorIngredientSauce
    ]);
  });

  it('handle createOrder.pending action', () => {
    const action = {
      type: createOrder.pending.type,
      payload: ['id1', 'id2']
    };

    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.orderRequest).toBe(true);
  });

  it('handle createOrder.fulfilled action', () => {
    const testOrder = {
      _id: '911',
      status: 'done',
      name: 'testOrder',
      createdAt: '13.09.2024',
      updatedAt: '13.09.2024',
      number: 911,
      ingredients: ['id1', 'id2']
    };

    const testApiResponse: TNewOrderResponse = {
      success: true,
      order: testOrder,
      name: 'testOrder'
    };

    const expectedState: BurgerConstructorSliceState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: testOrder,
      error: null,
      loading: false
    };

    const action = {
      type: createOrder.fulfilled.type,
      payload: testApiResponse
    };

    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state).toEqual(expectedState);
  });

  it('handle createOrder.rejected action', () => {
    const error = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      error: { message: error }
    };
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(error);
  });
});