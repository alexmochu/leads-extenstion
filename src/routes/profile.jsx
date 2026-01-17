import { Fragment } from 'react'
import { userState } from '../main'

export default function Profile() {
  const { user } = userState()
  const username = user.username
  return (
    <>
      <Fragment>
        <main>
          <div className='bg-white'>
            <div>
              <main className='mx-auto px-4 sm:px-6 lg:px-8'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-6'>
                  Profile
                </h1>
                <div className='border rounded-lg border-gray-200 p-6'>
                  <p className='mb-2'>Your username</p>
                  <h1 className='text-lg font-bold tracking-tight text-gray-900'>
                    @{username}
                  </h1>
                </div>
              </main>
            </div>
          </div>
        </main>
      </Fragment>
    </>
  )
}