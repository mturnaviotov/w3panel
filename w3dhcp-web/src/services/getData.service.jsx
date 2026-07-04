import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8082/api/v1/'

const getData = (link, params) => {
  axios.defaults.headers.common = { 'auth-token': authHeader(), 'Accept': 'application/json', 'Content-Type': 'application/json' }
  return axios.get(API_URL + link, { params: params })
    .then((response) => {
      return response.data
    })
}

const getDataService = {
  getData
}

export default getDataService
