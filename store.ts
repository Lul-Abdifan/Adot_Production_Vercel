import {configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';
import {adotApi} from './api/index'

export const store = configureStore({
    reducer:{
       [adotApi.reducerPath]: adotApi.reducer,
 
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([adotApi.middleware]),
  })
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch)