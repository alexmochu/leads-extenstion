import React, { Fragment, useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import Queries from '../api/queries'
import { userState } from '../main'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

export default function Login() {
  const { user, setUser } = userState()
  const [inputValue, setInputValue] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()
    const { username, password } = inputValue
    if (username.trim() === '') {
      setError({ ...error, username: 'Username can\'t be blank' })
    } else if (password.trim() === '') {
      setError({ ...error, password: 'Password can\'t be blank' })
    } else {
      // Handle form submission here
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('store'))
      await Queries.login(inputValue)
      const token = localStorage.getItem('headerAccessToken')
      const decoded = jwt_decode(token)
      setLoading(false)
      await setUser({
        ...user,
        username: decoded.username,
        email: decoded.email,
        id: decoded.id,
        isAuthenticated: true,
        showToast: true,
        toastMessage: 'You have logged in successfully.',
      })
      // Reset form
      setInputValue({ username: '', password: '' })
      setError({ username: '', password: '' })
      return navigate('/dashboard')
    }
  }

  const handleChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value })
    setError({ username: '', password: '' })
  }

  const isAuthenticated = user.isAuthenticated
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <Fragment>
      <div className='relative'>
        <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
          <div className='relative mt-32 ml-auto'>
            <div className='lg:w-2/3 text-center mx-auto'>
              <label className='block'>
                <h1 className='text-4xl font-bold tracking-tight mb-2 text-gray-900'>Login</h1>
                <span className='block text-sm font-medium text-slate-700'>
                  Dont have an account?{' '}
                  <Link className='text-indigo-500' to='/signup'>
                    Register
                  </Link>
                </span>
              </label>
              {loading ? (
                <div className='flex justify-center items-center mt-10'>
                  <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
                <div className='mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6'>
                  <form onSubmit={handleSubmit}>
                    <label className='block'>
                      <span className='block text-left text-sm font-medium text-slate-700'>
                        Username
                      </span>
                      <input
                        placeholder='Username'
                        aria-label='Username'
                        type='username'
                        name='username'
                        value={inputValue.username}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 ${
                              error.username && !inputValue.username ? 'border-red-500' : ''
                            }`}
                      />
                      {error.username && (
                        <span className='block text-left text-sm font-medium text-red-700'>
                          {error.username}
                        </span>
                      )}
                    </label>
                    <label className='block mt-2'>
                      <span className='block text-left text-sm font-medium text-slate-700'>
                        Password
                      </span>
                      <input
                        placeholder='Password'
                        aria-label='Password'
                        type='password'
                        name='password'
                        value={inputValue.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error.password && !inputValue.password ? 'border-red-500' : ''
                            }`}
                      />
                      {error.password && (
                        <span className='block text-left text-sm font-medium text-red-700'>
                          {error.password}
                        </span>
                      )}
                    </label>
                    <label className='block'>
                      <div className='mt-3 mb-4'>
                        <button
                          type='submit'
                          className='bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg'
                        >
                          Log In
                        </button>
                      </div>
                    </label>
                    <label className='block'>
                      <span className='block text-sm font-medium text-slate-700'>
                        Cant rememeber password?{' '}
                        <Link className='text-indigo-500' to='/forgot-password'>
                          Recover it.
                        </Link>
                      </span>
                    </label>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}