import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import ky from 'ky';

import { State } from '../index';
import formData from '../../utils/formData';

interface Token {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

interface FetchTokenAPIResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: null;
  token_type: string;
}

const fetchToken = createAsyncThunk<Token, void, { state: State }>(
  'auth/fetchToken',
  async (_args, thunkAPI) => {
    const {
      auth: {
        client: { id, secret, url, username, password },
      },
    } = thunkAPI.getState();

    const response = (await ky
      .post(`${url}/oauth/v2/token`, {
        body: formData({
          grant_type: 'password',
          client_id: id,
          client_secret: secret,
          username,
          password,
        }),
      })
      .json()) as FetchTokenAPIResponse;

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken,
    } = response;

    return { accessToken, expiresIn, refreshToken };
  },
  {
    condition(_args, { getState }) {
      return true;
    },
  },
);

const fetchRefreshToken = createAsyncThunk('auth/refreshToken', async (data, thunkAPI) => {
  const {
    auth: {
      client: { id, secret, url },
      token: { refreshToken },
    },
  } = thunkAPI.getState() as State;
  const response = (await ky
    .post(`${url}/oauth/v2/token`, {
      body: formData({
        grant_type: 'refresh_token',
        client_id: id,
        client_secret: secret,
        refresh_token: refreshToken,
      }),
    })
    .json()) as FetchTokenAPIResponse;

  console.log({ response });
  return response;
});

const { reducer, actions: sliceActions } = createSlice({
  name: 'auth',
  initialState: {
    client: {
      id: '',
      secret: '',
      username: '',
      password: '',
      url: '',
    },
    token: {
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
    } as Token,
    loading: 'idle' as 'idle' | 'pending',
    currentRequestId: undefined as string | undefined,
    error: null as null | SerializedError,
  },
  reducers: {
    setServerUrl: (state, { payload: newServerUrl }: PayloadAction<string>) => {
      state.client.url = newServerUrl;
    },
    setClientId: (state, { payload: newClientId }: PayloadAction<string>) => {
      state.client.id = newClientId;
    },
    setClientSecret: (state, { payload: newClientSecret }: PayloadAction<string>) => {
      state.client.secret = newClientSecret;
    },
    setUsername: (state, { payload: newUserName }: PayloadAction<string>) => {
      state.client.username = newUserName;
    },
    setPassword: (state, { payload: newPassword }: PayloadAction<string>) => {
      state.client.password = newPassword;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchToken.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    });

    builder.addCase(fetchToken.fulfilled, (state, action) => {
      const { requestId } = action.meta;

      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.currentRequestId = undefined;
        state.token = action.payload;
      }
    });

    builder.addCase(
      fetchToken.rejected,

      (state, action) => {
        const { requestId } = action.meta;
        if (state.loading === 'pending' && state.currentRequestId === requestId) {
          state.loading = 'idle';
          state.error = action.error;
          state.currentRequestId = undefined;
        }
      },
    );
  },
});

const actions = {
  ...sliceActions,
  fetchToken,
  fetchRefreshToken,
};

export { reducer as default, actions };
