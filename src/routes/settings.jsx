import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
  return (
    <Fragment>
      <main>
        <div className='bg-white'>
          <div>
            <main className='mx-auto px-4 sm:px-6 lg:px-8'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-6'>
                Settings
              </h1>
              <div className='border rounded-lg border-gray-200 p-6'>
                <p className='mb-2'>Change your password at anytime</p>
            <Link className='text-indigo-500 bg-indigo-500'
            key={'change-password'}
            to={'/dashboard/change-password'}
            aria-current={'page'}>
                <button className='border bg-indigo-500 rounded-lg px-4 py-2 text-lg font-bold tracking-tight text-white'>
                  Change password
                </button>
            </Link>
              </div>
            </main>
          </div>
        </div>
      </main>
    </Fragment>
  )
}