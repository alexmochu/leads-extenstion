import { Link } from 'react-router-dom'

const AppFooter = () => (
  <footer className='py-10'>
    <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
      <div className='m-auto md:w-10/12 lg:w-8/12 xl:w-6/12'>
        <div className='flex flex-wrap items-center justify-between md:flex-nowrap'>
          <div className='m-auto mt-4 w-10/12 space-y-6 text-center sm:mt-auto sm:w-5/12 sm:text-left'>
            <span className='block text-gray-500 dark:text-gray-400'>Bringing Ideas to Life</span>
            <span className='flex justify-between text-gray-600 dark:text-white'>
              <Link
                key={'terms'}
                to={'/terms-conditions'}
                aria-current={'page'}
                className='flex flex-shrink-0 items-center bg-white text-gray-800 px-2'
              >
                Terms of Use
              </Link>
              <Link
                key={'policy'}
                to={'/privacy-policy'}
                aria-current={'page'}
                className='flex flex-shrink-0 items-center bg-white text-gray-800 px-2'
              >
                Privacy Policy
              </Link>
              <Link
                key={'contacts'}
                to={'/contact-us'}
                aria-current={'page'}
                className='flex flex-shrink-0 items-center bg-white text-gray-800 px-2'
              >
                Contact Us
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default AppFooter