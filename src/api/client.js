import axios from 'axios'
// localhost --> http://127.0.0.1:5000/
// production --> https://jobs.kejanigarage.com/

const baseURL = import.meta.env.VITE_API_BASE_URL

const getHeaderAccessToken = () => {
  return localStorage.getItem('headerAccessToken')
}

var axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'header-access-token': getHeaderAccessToken(),
  },
})

// Interceptor to update the header access token before each request
axiosInstance.interceptors.request.use(
  function (config) {
    config.headers['header-access-token'] = getHeaderAccessToken()
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axiosInstance
