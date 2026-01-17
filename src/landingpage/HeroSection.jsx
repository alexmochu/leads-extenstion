import { Link } from 'react-router-dom'

const HeroSection = () => (
  <div className='relative' id='home'>
    {/* <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
<div className="blur-[106px] h-32 bg-gradient-to-br from-cyan-800 to-purple-800 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-800 to-sky-600 dark:to-indigo-600"></div>
    </div> */}
    <div className='max-w-7xl pt-20 mx-auto px-6 md:px-12 xl:px-6'>
      <div className='relative mt-10 ml-auto'>
        <div className='lg:w-2/3 text-center mx-auto'>
          <h1 className='text-gray-900 dark:text-white font-bold text-2xl'>
            Find Your Dream Job with Our{' '}
            <span className='text-primary dark:text-white'> AI-Powered</span> Solutions
          </h1>
          <p className='mt-8 text-lg text-gray-700 dark:text-gray-300'>
            Streamline Your Job Search, Create a Winning Resume, Cover letters and Ace Your
            Interviews with Our AI tools
          </p>
          <div className='mt-5 flex flex-wrap justify-center gap-y-4 gap-x-6'>
            <Link
              to='/login'
              className='relative rounded-3xl border bg-indigo-500 flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max'
            >
              <span className='relative text-base font-semibold text-white'>Get started</span>
            </Link>
            <Link
              to='/FAQs'
              className='relative rounded-3xl border bg-gray-900 flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max'
            >
              <span className='relative text-base font-semibold text-white dark:text-white'>
                Learn more
              </span>
            </Link>
          </div>
          <div className='hidden py-8 mt-8 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between'>
            <div className='text-left'>
              <h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
                AI-Driven Resumes That Get Noticed.
              </h6>
            </div>
            <div className='text-left'>
              <h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
                Master the Art of Interviews.
              </h6>
            </div>
            <div className='text-left'>
              <h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
                Supercharge Your Job Search.
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default HeroSection