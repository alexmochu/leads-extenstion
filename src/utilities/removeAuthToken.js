import axios from 'axios'
// import jwt from 'jsonwebtoken'

// export const isTokenExpired = (token) => {
//   const currentTime = new Date() / 1000
//   if (jwt.decode(token).exp < currentTime) {
//     localStorage.removeItem('JWT')
//     return true
//   }
//   return false
// }

export default function removeAuthToken(token) {
  if (token) {
    localStorage.removeItem('headerAccessToken')
    delete axios.defaults.headers.common['header-access-token']
  } else {
    delete axios.defaults.headers.common['header-access-token']
  }
}
