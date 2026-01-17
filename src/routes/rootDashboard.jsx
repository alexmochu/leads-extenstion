import { Fragment, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Spinner from '../components/spinner'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Fragment>
      <div className={`p-4`}>
        {loading ? (
          <Spinner />
        ) : (
          <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14'>
            <Outlet />
          </div>
        )}
      </div>
    </Fragment>
  )
}