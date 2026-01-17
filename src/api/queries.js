import api from './api'
import setAuthToken from '../utilities/setAuthToken'
import removeAuthToken from '../utilities/removeAuthToken'

const landingPage = async () => {
  const response = await api.home.landingPage()
  return response
}

const signup = async (user) => {
  const response = await api.user.signup(user)
  return response
}

const login = async (credentials) => {
  const response = await api.user.login(credentials)
  const token = response.header_access_token
  localStorage.headerAccessToken = token
  return setAuthToken(token)
}

const logout = async () => {
  const response = await api.user.logout()
  const token = localStorage.getItem('headerAccessToken')
  removeAuthToken(token)
  localStorage.removeItem(token)
  return response
}

const createJob = async (job) => {
  const response = await api.jobs.jobCreate(job)
  return response
}

const updateJob = async (user) => {
  const response = await api.jobs.jobUpdate(user)
  return response
}

const deleteJob = async (id) => {
  const response = await api.jobs.jobDelete(id)
  return response
}

const getCurrentUserJobs = async (username) => {
  const response = await api.jobs.jobsUser(username)
  return response
}

const getJobSummary = async () => {
  const response = await api.jobs.jobSummary()
  return response
}

const createVerifyEmail = async (email) => {
  const response = await api.email.createVerifyEmail(email)
  return response
}

const verifyEmail = async (items) => {
  const response = await api.email.verifyEmail(items)
  return response
}

const forgotPassword = async (email) => {
  const response = await api.user.forgotPassword(email)
  return response
}

const resetForgotPassword = async (items) => {
  const response = await api.email.resetForgotPassword(items)
  return response
}

const changePassword = async (passwords) => {
  const response = await api.user.changePassword(passwords)
  return response  
}

const Queries = {
  landingPage,
  signup,
  login,
  logout,
  createJob,
  updateJob,
  deleteJob,
  getCurrentUserJobs,
  getJobSummary,
  createVerifyEmail,
  verifyEmail,
  forgotPassword,
  resetForgotPassword,
  changePassword
}

export default Queries
