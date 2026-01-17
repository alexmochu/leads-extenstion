import axios from 'axios'

export default function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['header-access-token'] = `${token}`
  } else {
    delete axios.defaults.headers.common['header-access-token']
  }
}
