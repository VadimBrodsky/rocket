import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { State } from '../index';
import ky from 'ky';
import config from '../../config';

const fetchToken = createAsyncThunk(
  'auth/fetchToken',
  async (data: { username: string; password: string }, thunkAPI) => {
    const {
      auth: { clientId, clientSecret },
    } = thunkAPI.getState() as State;
    return await ky
      .post(`${config.SERVER_URL}/oauth/v2/token`, {
        searchParams: {
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username: data.username,
          password: data.password,
        },
      })
      .json();
  },
);

const fetchRefreshToken = createAsyncThunk('auth/refreshToken', async (data, thunkAPI) => {
  const {
    auth: { clientId, clientSecret, refreshToken },
  } = thunkAPI.getState() as State;
  return await ky
    .post(`${config.SERVER_URL}/oauth/v2/token`, {
      searchParams: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      },
    })
    .json();
});

const { reducer, actions } = createSlice({
  name: 'auth',
  initialState: {
    accessToken: '',
    clientId: '',
    clientSecret: '',
    username: '',
    password: '',
    refreshToken: '',
  },
  reducers: {
    setAccessToken: (state, { payload: newToken }: PayloadAction<string>) => {
      state.accessToken = newToken;
      return state;
    },
  },
});

export { reducer as default, actions };
