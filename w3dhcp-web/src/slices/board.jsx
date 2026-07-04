import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {setMessage} from './message'

import getDataService from '../services/getData.service'

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (args, thunkAPI) => {
	try {
	  const data = await getDataService.getData('board')
	  thunkAPI.dispatch(boardSlice.actions.fetch(data))
	} catch (error) {
	  const message =
		(error.response &&
		  error.response.data &&
		  error.response.data.message) ||
		  error.message ||
		  error.toString()
	  thunkAPI.dispatch(setMessage(message))
	  return thunkAPI.rejectWithValue()
	}
  }
)

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
	loaded: false
  },
  reducers: {
	fetch: (state, action) => {
	  state.board = action.payload
	  state.loaded = true
	}
  }
})

export const { reducer, actions } = boardSlice
export default reducer
