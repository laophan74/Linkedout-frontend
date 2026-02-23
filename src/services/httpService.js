import Axios from 'axios'
import { API_CONFIG, HTTP_CONFIG, STORAGE_CONFIG } from '../config/constants'

const BASE_URL = API_CONFIG.BASE_URL

var axios = Axios.create({
  withCredentials: false,
  validateStatus: function (status) {
    return status >= HTTP_CONFIG.SUCCESS_CODES.MIN && status <= HTTP_CONFIG.SUCCESS_CODES.MAX
  },
  timeout: HTTP_CONFIG.TIMEOUT,
})

// Add JWT token to requests
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(STORAGE_CONFIG.TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  },
}

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === 'GET' ? data : null,
    })
    if (res.data && res.data.success && 'data' in res.data) {
      return res.data.data
    }
    // If response is not successful, throw error with backend message
    if (res.data && !res.data.success) {
      throw new Error(res.data.message || 'Request failed')
    }
    return res.data
  } catch (err) {
    console.error('HTTP Error:', err)
    throw err
  }
}
