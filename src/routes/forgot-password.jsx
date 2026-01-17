import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { userState } from '../main'
import Queries from '../api/queries'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = userState()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (email.trim() === '') {
      setError('Email cannot be empty')
    } else if (!isValidEmail(email)) {
      setError('Invalid email address')
    } else {
      // Handle form submission here
      setLoading(true)
      const info = {mail: email.toLocaleLowerCase()}
      await Queries.forgotPassword(info.mail)
      setLoading(false)
      await setUser(prevState => ({
      ...prevState,
      showToast: true,
      toastMessage: 'A password reset link has been sent to your email.'
    }))  
      // Reset form
      setEmail('')
      setError('')
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <Fragment>
      <div className='relative' id='home'>
        <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
          <div className='relative mt-32 ml-auto'>
            <div className='lg:w-2/3 text-center mx-auto'>
              <label className='block'>
                <h1 className='text-4xl font-bold tracking-tight mb-2 text-gray-900'>
                  Recover password
                </h1>
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
                      value={email}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error ? 'border-red-500' : ''
                            }`}
                    />
                    {error && (
                      <span className='block text-left text-sm font-medium text-red-700'>
                        {error}
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
                        Submit
                      </button>
                    </div>
                  </label>
                  <label className='block'>
                    <span className='block text-sm font-medium text-slate-700'>
                      Rememeber password?{' '}
                      <Link className='text-indigo-500' to='/login'>
                        Login
                      </Link>
                    </span>
                  </label>
                </form>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}