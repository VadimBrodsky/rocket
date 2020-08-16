import { configureStore, combineReducers } from '@reduxjs/toolkit';
import auth from './slices/auth';

const store = configureStore({
  reducer: combineReducers({
    auth,
  }),
});

export default store;
export type State = ReturnType<typeof store.getState>;
