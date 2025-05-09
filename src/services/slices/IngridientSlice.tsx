import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

interface ingredientsSliceState {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const initialState: ingredientsSliceState = {
  data: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchData',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  },
  selectors: {
    getAllIngredients: (state) => state.data,
    loading: (state) => state.loading
  }
});

export default ingredientsSlice;
export const { getAllIngredients, loading } = ingredientsSlice.selectors;