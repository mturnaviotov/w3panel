import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const currentLang = localStorage.getItem("lang") || 'uk'

export const setLang = createAsyncThunk(
  "lang/setLang",
  async (args, thunkAPI) => {
    thunkAPI.dispatch(LangSlice.actions.setLang(args.lang))
  }
)

const LangSlice = createSlice({
  name: 'languages',
  initialState: {
    list: ['uk','en'],
    lang: currentLang,
  },
  reducers: {
    getLang: (state, action) => {
      const lang = localStorage.getItem("lang") || 'uk'
      state.lang = lang
    },
    setLang: (state, action) => {
      localStorage.setItem('lang', action.payload)
      state.lang = action.payload
    },
  }
})

export const { reducer, actions } = LangSlice
export default reducer
