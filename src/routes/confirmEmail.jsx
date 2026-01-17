import { Fragment, useEffect } from 'react'
import Queries from '../api/queries'
import { useParams } from 'react-router-dom';

export default function ConfirmEmail() {
  const { id } = useParams();
  const item = {
    token: id
  }
  useEffect(() => {
    Queries.verifyEmail(item)
  }, [])


  return (
    <Fragment>
      <div className='relative dark:bg-gray-900 min-h-screen' id='home'>
        <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
          <div className='relative pt-60 ml-auto'>
            <div className='lg:w-2/3 text-center mx-auto'>
              <label className='block'>
                <h1 className='text-4xl dark:text-white font-bold tracking-tight mb-2 text-gray-900'>
                  Account Verified! 🎉
                </h1>
              </label>
              <div className='mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6'>
                  <label className='block'>
                    <span className='block dark:text-white text-2xl text-slate-700'>
                      Welcome back! Your account is now verified and ready to go! 😃{' '}
                    </span>
                  </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}