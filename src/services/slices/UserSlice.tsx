import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  TRegisterData,
  TLoginData,
  getUserApi,
  logoutApi,
  updateUserApi,
  getOrdersApi
} from '../../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { TUser, TOrder } from '@utils-types';


interface UserState {
  user: TUser | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
}

export const initialState: UserState = {
  user: null,
  orders: [],
  loading: false,
  error: null,
  isAuthChecked: false,
  isAuthenticated: false
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const userApi = createAsyncThunk('user/userApi', getUserApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        await dispatch(userApi()).unwrap();
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    }
    dispatch(authChecked());
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userApi.pending, (state) => {
        state.isAuthenticated = false;
        state.error = null;
        state.user = null;
        state.loading = true;
      })
      .addCase(userApi.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(userApi.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch user data';
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = true;
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.clear();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.error.message || 'Failed to log out user';
      })
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload as TOrder[];
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    userData: (state) => state.user,
    loading: (state) => state.loading,
    userOrders: (state) => state.orders,
    responseError: (state) => state.error,
    isAuthenticated: (state) => state.isAuthenticated,
    isAuthChecked: (state) => state.isAuthChecked
  }
});

export const { authChecked } = userSlice.actions;

export default userSlice;

export const {
  userData,
  loading,
  userOrders,
  responseError,
  isAuthenticated,
  isAuthChecked
} = userSlice.selectors;