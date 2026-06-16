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

const storage = STORAGE_CONFIG.STORAGE_TYPE === 'localStorage' ? localStorage : sessionStorage

// Add JWT token to requests
axios.interceptors.request.use((config) => {
  const token = storage.getItem(STORAGE_CONFIG.TOKEN_KEY)
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
    const payload = data?.formData || data
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data: method === 'GET' ? null : payload,
      params: method === 'GET' ? data : null,
    })
    if (res.data && res.data.success && 'data' in res.data) {
      if (Array.isArray(res.data.data) && res.data.pagination) {
        Object.defineProperty(res.data.data, '_pagination', {
          value: res.data.pagination,
          enumerable: false,
        })
      }
      return res.data.data
    }
    // If response is not successful, throw error with backend message
    if (res.data && !res.data.success) {
      const error = new Error(res.data.message || 'Request failed')
      error.status = res.status
      error.response = res
      error.endpoint = endpoint
      throw error
    }
    return res.data
  } catch (err) {
    if (!err.response && !err.status) {
      err.message = err.message || 'Network request failed'
      err.endpoint = endpoint
    }
    console.error('HTTP Error:', err)
    throw err
  }
}
