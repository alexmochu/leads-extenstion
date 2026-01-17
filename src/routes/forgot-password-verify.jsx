import { Fragment, useState } from 'react'
import Queries from '../api/queries'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'
import { userState } from '../main'

export default function ForgotPasswordVerify() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false)

  const [inputValue, setInputValue] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const { setUser } = userState()
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    const decoded = jwt_decode(id);
    event.preventDefault()
    const {newPassword, confirmPassword} = inputValue
    if (newPassword.trim() === '') {
      setError({ ...error, newPassword: 'New password cannot be empty'})
    } else if (confirmPassword.trim() === '') {
      setError({ ...error, confirmPassword: 'Confirm password cannot be empty'})
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      setError({ 
        confirmPassword: 'Passwords should be same', 
        newPassword: 'Passwords should be same',
       })
    } else {
      // Handle form submission here
      setLoading(true);
      // eslint-disable-next-line camelcase
      await Queries.resetForgotPassword({token:id, id: decoded.reset_password,  password: newPassword, confirm_password: confirmPassword})
      setLoading(false)
      await setUser(prevState => ({
      ...prevState,
      showToast: true,
      toastMessage: 'Your password has been reset succesfully. Please login'
      })) 
      // Reset form
      setInputValue({ confirmPassword: '', newPassword: '' })
      setError({ confirmPassword: '', newPassword: '' })
      return navigate('/login')
    }
  }

  const handleChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value })
    setError({ confirmPassword: '', newPassword: '' })
  }

  return (
    <Fragment>
      <div className='relative dark:bg-gray-900 min-h-screen' id='home'>
        <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
          <div className='relative pt-60 ml-auto'>
            <div className='lg:w-2/3 text-center mx-auto'>
              <label className='block'>
                <h1 className='text-4xl dark:text-white font-bold tracking-tight mb-2 text-gray-900'>
                  Reset password
                </h1>
              </label>
              {loading ? (
                <div className='flex justify-center items-center mt-10'>
                  <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
                <div className='mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6'>
                  <form onSubmit={handleSubmit}>
                    <label className='block mt-2'>
                      <span className='block dark:text-white text-left text-sm font-medium text-slate-700'>
                        New Password
                      </span>
                      <input
                        placeholder='New Password'
                        aria-label='Password'
                        type='password'
                        name='newPassword'
                        value={inputValue.newPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error.newPassword && !inputValue.newPassword ? 'border-red-500' : ''
                            }`}
                      />
                      {error.newPassword && (
                        <span className='block text-left text-sm font-medium text-red-700'>
                          {error.newPassword}
                        </span>
                      )}
                    </label>
                    <label className='block mt-2'>
                      <span className='block dark:text-white text-left text-sm font-medium text-slate-700'>
                        Confirm Password
                      </span>
                      <input
                        placeholder='Confirm Password'
                        aria-label='Password'
                        type='password'
                        name='confirmPassword'
                        value={inputValue.confirmPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error.confirmPassword && !inputValue.confirmPassword ? 'border-red-500' : ''
                            }`}
                      />
                      {error.confirmPassword && (
                        <span className='block text-left text-sm font-medium text-red-700'>
                          {error.confirmPassword}
                        </span>
                      )}
                    </label>
                    <label className='block'>
                      <div className='mt-3 mb-4'>
                        <button
                          type='submit'
                          className='bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg'
                        >
                          Submit
                        </button>
                      </div>
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