import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 mt-2 gap-3 h-full mb-2 rounded dark:bg-gray-800'>
      <div className='flex flex-row justify-between bg-gray-50 h-fit rounded-3xl border-2 px-5 py-1'>
        <div className='flex items-center justify-center text-base'>
          Jobs Tracker
        </div>
        <div className='flex items-center justify-center pb-4'>
          <Link
            key={'jobs'}
            to={'/dashboard/jobs'}
            aria-current={'page'}
            className='flex flex-shrink-0 items-center text-gray-800'
          >
            <button className='bg-indigo-500 rounded-3xl px-5 py-1 mt-5 text-white text-base'>
              View
            </button>
          </Link>
        </div>
      </div>
      <div className='flex flex-row justify-between bg-gray-50 h-fit rounded-3xl border-2 px-5 py-1'>
        <div className='flex items-center justify-center text-base'>
          Resume Builder
        </div>
        <div className='flex items-center justify-center pb-4'>
          <Link
            key={'jobs'}
            to={'/dashboard/resume'}
            aria-current={'page'}
            className='flex flex-shrink-0 items-center text-gray-800 px-2'
          >
            <button
              disabled
              className='bg-indigo-500 rounded-3xl px-5 py-1 mt-5 text-white text-base'
            >
              Coming Soon
            </button>
          </Link>
        </div>
      </div>
      <div className='flex flex-row justify-between bg-gray-50 h-fit rounded-3xl border-2 px-5 py-1'>
        <div className='flex items-center justify-center text-base'>
          Cover Letter Builder
        </div>
        <div className='flex items-center justify-center pb-4'>
          <Link
            key={'jobs'}
            to={'/dashboard/cover-letter'}
            aria-current={'page'}
            className='flex flex-shrink-0 items-center text-gray-800 px-2'
          >
            <button disabled className='bg-indigo-500 rounded-3xl px-5 py-1 mt-5 text-white text-base'>
              Comming Soon
            </button>
          </Link>
        </div>
      </div>
      <div className='flex flex-row justify-between bg-gray-50 h-fit rounded-3xl border-2 px-5 py-1'>
        <div className='flex items-center justify-center text-base pr-4'>
          Question & Answer AI Assistant
        </div>
        <div className='flex items-center justify-center pb-4'>
          <Link
            key={'jobs'}
            to={'/dashboard/qa'}
            aria-current={'page'}
            className='flex flex-shrink-0 items-center text-gray-800 px-2'
          >
            <button
              disabled
              className='bg-indigo-500 rounded-3xl px-5 py-1 mt-5 text-white text-base'
            >
              Comming Soon
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}