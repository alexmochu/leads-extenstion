import { Fragment, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Queries from '../api/queries'
import { userState } from '../main'

export default function SignUp() {
  const { user, setUser } = userState()
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState({
    email: '',
    username: '',
    password: '',
  })
  const [error, setError] = useState({
    email: '',
    username: '',
    password: '',
  })

  const onChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value })
    setError({ email: '', username: '', password: '' })
  }

  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()
    const { email, username, password } = inputValue
    if (email.trim() === '') {
      setError({ ...error, email: 'Email cannot be empty' })
    } else if (!isValidEmail(email)) {
      setError({ ...error, email: 'Invalid email address' })
    } else if (
      email !== 'mochualex4@gmail.com' &&
      email !== 'karanjamochu@gmail.com' &&
      email !== 'garagekejani@gmail.com'
    ) {
      setError({ ...error, email: 'Be Patient, Signup Power Unleashing Soon!' })
    } else if (username.trim() === '') {
      setError({ ...error, username: 'Username can\'t be blank' })
    } else if (password.trim() === '') {
      setError({ ...error, password: 'Password can\'t be blank' })
    } else {
      // Handle form submission here
      setLoading(true)
      await Queries.signup({email: email.toLowerCase(), username: username.toLowerCase(), password: password})
      const info = {email: email.toLowerCase()}
      await Queries.createVerifyEmail(info.email)
      await setUser({
        ...user,
        showToast: true,
        toastMessage: 'You have signed up for an account successfully.',
      })
      setLoading(false)
      // Reset form
      setInputValue({ email: '', username: '', password: '' })
      setError({ email: '', username: '', password: '' })
      return navigate('/login')
    }
  }

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isAuthenticated = user.isAuthenticated
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <Fragment>
      <main>
        <div className='relative' id='home'>
          <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
            <div className='relative mt-32 ml-auto'>
              <div className='lg:w-2/3 text-center mx-auto'>
                <label className='block'>
                  <h1 className='text-4xl font-bold tracking-tight text-gray-900'>Signup</h1>
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
                          Email
                        </span>
                        <input
                          placeholder='Email'
                          aria-label='Email Address'
                          type='text'
                          name='email'
                          value={inputValue.email}
                          onChange={onChange}
                          className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error.email ? 'border-red-500' : ''
                            }`}
                        />
                        {error.email && (
                          <span className='block text-left text-sm font-medium text-red-700'>
                            {error.email}
                          </span>
                        )}
                      </label>
                      <label className='block mt-2'>
                        <span className='block text-left text-sm font-medium text-slate-700'>
                          Username
                        </span>
                        <input
                          placeholder='Username'
                          aria-label='Username'
                          type='username'
                          name='username'
                          value={inputValue.username}
                          onChange={onChange}
                          className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 ${
                              error.username ? 'border-red-500' : ''
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
                          onChange={onChange}
                          className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 ${
                              error.password ? 'border-red-500' : ''
                            }`}
                        />
                        {error.password && (
                          <span className='block text-left text-sm font-medium text-red-700'>
                            {error.password}
                          </span>
                        )}
                      </label>
                      <label className='block'>
                        <div className='mt-5 mb-4'>
                          <button
                            type='submit'
                            className='bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'
                          >
                            Signup
                          </button>
                        </div>
                        <span className='block text-sm font-medium text-slate-700'>
                          Already have an account?{' '}
                          <Link className='text-indigo-500' to='/login'>
                            Login
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
      </main>
    </Fragment>
  )
}