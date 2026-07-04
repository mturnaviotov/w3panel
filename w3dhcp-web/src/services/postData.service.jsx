import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8082/api/v1/'

const postData = (link, body) => {
  axios.defaults.headers.common = { 'auth-token': authHeader(), 'Accept': 'application/json', 'Content-Type': 'application/json' }
  return axios.post(API_URL + link, body)
    .then((response) => {
      return response.data
    })
}

const deleteData = (link) => {
  axios.defaults.headers.common = { 'auth-token': authHeader(), 'Accept': 'application/json', 'Content-Type': 'application/json' }
  return axios.delete(API_URL + link)
    .then((response) => {
      return response.data
    })
}

const putData = (link, body) => {
  axios.defaults.headers.common = { 'auth-token': authHeader(), 'Accept': 'application/json', 'Content-Type': 'application/json' }
  return axios.put(API_URL + link, body)
    .then((response) => {
      return response.data
    })
}

const postDataService = {
  postData, putData, deleteData
}

export default postDataService
