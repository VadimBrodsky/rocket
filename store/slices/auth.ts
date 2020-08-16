import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null as null | string,
    clientId: '',
    clientSecret: '',
  },
  reducers: {
    setAccessToken: (state, { payload: newToken }: PayloadAction<string>) => {
      state.accessToken = newToken;
      return state;
    },
  },
});

export { reducer as default, actions };
