import {useEffect, useMemo, useState} from 'react'
import {createSlice, configureStore } from '@reduxjs/toolkit'
import {useSelector, useDispatch, Provider} from 'react-redux'
import {HashRouter, Route, Routes, Link, } from 'react-router-dom'
import {fetchJSON, pause} from './Test2'

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    loaded: false,
    loading: false,
    sortingById: 'asc'
  },
  reducers: {
    fetchPostsSuccess (state, action) {
      //@ts-ignore
      state.list = action.payload
    },
    toggleSorting (state) {
      state.sortingById = (state.sortingById === 'asc') ? 'desc' : 'asc'
      state.list.sort((a, b) => {
        return (state.sortingById === 'asc') ? a.id - b.id : b.id - a.id
      })
    }
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loaded: false,
    loading: false
  },
  reducers: {
    fetchUsersSuccess(state, action){
      //@ts-ignore
      state.list = action.payload
    }
  }
})

const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    users: usersSlice.reducer
  },
  devTools: true
})

function getPosts () {
  return async dispatch => {
    const posts = await fetchJSON(`https://jsonplaceholder.typicode.com/posts?_limit=2`)

    dispatch(postsSlice.actions.fetchPostsSuccess(posts))
  }
}

function getUsers () {
  return async dispatch => {
    const users = await fetchJSON(`https://jsonplaceholder.typicode.com/users?_limit=2`)

    await pause(2000)

    dispatch(usersSlice.actions.fetchUsersSuccess(users))
  }
}

function Posts () {
  //@ts-ignore
  const posts = useSelector(store => store.posts.list)
  //@ts-ignore
  const users = useSelector(store => store.users.list)
  //@ts-ignore
  const sortOrder = useSelector(store => store.posts.sortingById)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!posts.length) {
      dispatch(getPosts())
      dispatch(getUsers())
    }
  }, [])

  const fullPosts = useMemo(() => {
    return posts.map(post => {
      return {
        ...post,
        userName: users?.find(user => user.id === post.userId)?.name
      }
    })
  }, [posts, users])

  return <div>
    Posts:
    <button onClick={() => {
      dispatch(postsSlice.actions.toggleSorting())
    }}>toggle sort</button>
    currently: {sortOrder}
    <pre>
      {JSON.stringify(fullPosts, null, '  ')}
    </pre>
  </div>
}

function Users () {
  //@ts-ignore
  const users = useSelector(store => store.users.list)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers())
    }
  }, [])

  return <div>
    Posts:
    <pre>
      {JSON.stringify(users, null, '  ')}
    </pre>
  </div>
}

function Home () {
  return <div>
    Home
  </div>
}

export default function Redux () {
  return <div>
    <Provider store={store}>
      <HashRouter>
        <div>
          <Link to={'/posts'}>posts</Link>
          <Link to={'/users'}>users</Link>
          <hr />
        </div>

        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/posts'} element={<Posts />} />
          <Route path={'/users'}  element={<Users />}/>
        </Routes>
      </HashRouter>
    </Provider>
  </div>
}