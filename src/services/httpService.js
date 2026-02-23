import Axios from 'axios'

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://linkedout-backend.vercel.app/api/'
    : 'http://localhost:3030/api/')

var axios = Axios.create({
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 300
  }
})

// Add JWT token to requests
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
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
