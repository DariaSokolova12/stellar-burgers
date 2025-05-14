import userSlice, {
  registerUser,
  loginUser,
  logoutUser,
  updateUserData,
  getUserOrders,
  initialState
} from './UserSlice';
import { TUser, TOrder } from '@utils-types';

describe('userSlice reducer', () => {
  it('handle registerUser.pending action', () => {
    const action = { type: registerUser.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handle registerUser.fulfilled action', () => {
    const testUser: TUser = {
      email: 'fake-user@gmail.com',
      name: 'Fake User'
    };
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        user: testUser,
        accessToken: 'token',
        refreshToken: 'refreshToken'
      }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(testUser);
  });

  it('handle registerUser.rejected action', () => {
    const error = 'Failed to register';
    const action = {
      type: registerUser.rejected.type,
      payload: error
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('handle loginUser.pending action', () => {
    const action = { type: loginUser.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handle loginUser.fulfilled action', () => {
    const testUser: TUser = {
      email: 'fake-user@gmail.com',
      name: 'Fake User'
    };
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        user: testUser,
        accessToken: 'token',
        refreshToken: 'refreshToken'
      }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(testUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('handle loginUser.rejected action', () => {
    const error = 'Failed to login';
    const action = {
      type: loginUser.rejected.type,
      payload: error
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('handle logoutUser.pending action', () => {
    const action = { type: logoutUser.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('handle logoutUser.fulfilled action', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('handle logoutUser.rejected action', () => {
    const error = 'Failed to logout';
    const action = {
      type: logoutUser.rejected.type,
      error: { message: error }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('handle updateUserData.pending action', () => {
    const action = { type: updateUserData.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handle updateUserData.fulfilled action', () => {
    const testUser: TUser = {
      email: 'fake-user@gmail.com',
      name: 'Fake User'
    };
    const action = {
      type: updateUserData.fulfilled.type,
      payload: { user: testUser }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(testUser);
  });

  it('handle updateUserData.rejected action', () => {
    const error = 'Failed to update user data';
    const action = {
      type: updateUserData.rejected.type,
      payload: error
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('handle getUserOrders.pending action', () => {
    const action = { type: getUserOrders.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handle getUserOrders.fulfilled action', () => {
    const testOrders: TOrder[] = [
      {
        _id: '911',
        status: 'done',
        name: 'testOrder',
        createdAt: '13.09.2024',
        updatedAt: '13.09.2024',
        number: 911,
        ingredients: ['id1', 'id2']
      }
    ];
    const action = {
      type: getUserOrders.fulfilled.type,
      payload: testOrders
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(testOrders);
  });

  it('handle getUserOrders.rejected action', () => {
    const error = 'Failed to fetch user orders';
    const action = {
      type: getUserOrders.rejected.type,
      payload: error
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});