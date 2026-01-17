import client from './client'

export default {
  home: {
    landingPage: () => client.get('/api').then((res) => res.data),
  },
  user: {
    login: (credentials) => client.post('/api/login', { credentials }).then((res) => res.data),
    logout: () => client.post('/api/logout'),
    signup: (user) => client.post('/api/register', { user }).then((res) => res.data.user),
    changePassword: (passwords) => client.put('/api/change-password', {passwords}).then((res) => res.data),
    forgotPassword: (email) =>
      client.post('/api/reset-password', { email }).then((res) => res.data.user),
  },
  jobs: {
    jobsUser: (username) => client.get(`/api/jobs/${username}`, { username }).then((res) => res.data),
    jobSummary: () => client.get('/api/job_summary').then((res) => res.data),
    jobCreate: (job) => client.post(`/api/jobs`, { job }).then((res) => res.data),
    jobUpdate: (job) => client.put(`/api/job/${job.job_id}`, { job }).then((res) => res.data),
    jobDelete: (id) => client.delete(`/api/job/${id}`, { id }).then((res) => res.data)
  },
  email: {
    createVerifyEmail: (email) =>
      client.post('/api/create-verify-email', {email}).then((res) => res.data),
    verifyEmail: (info) =>
      client.post(`/api/verify-email/${info.token}`, {info}).then((res) => res.data),
    resetForgotPassword: (info) =>
      client.put(`/api/reset-password/${info.token}`, {info}).then((res) => res.data)
  }
}
