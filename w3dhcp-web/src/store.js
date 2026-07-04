import {configureStore} from '@reduxjs/toolkit'
import { api } from './services/api'
import authReducer from './slices/auth'
import messageReducer from './slices/message'
import boardReducer from './slices/board'

import langReducer from './slices/lang'

const reducer = {
  auth: authReducer,
  board: boardReducer,
  lang: langReducer,
  message: messageReducer,

  [api.reducerPath]: api.reducer,
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export default store
