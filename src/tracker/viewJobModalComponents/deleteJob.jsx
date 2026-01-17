import { useState } from 'react'
import { countries } from '../../countries'
import { jobTypes } from '../../jobTypes'
import Queries from '../../api/queries'
import { userState } from '../../main'

const jobDetails = {
  jobUrl: '',
  jobSummary: '',
  jobTitle: '',
  jobCompany: ''
}

const jobInfo = {
  title: 'Kenya',
  country: 'Kenya',
  type: 'Kenya',
}

const jobTypeInfo = {
    type: 'Remote'
}

function DeleteJob({setViewState, job, closeModal}) {
  const { user, setUser } = userState()
  const [jobData, setJobData] = useState(jobDetails)
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    setJobData(jobDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({ ...prevState, [name]: value }));
  };

    const [jobState, setJobState] = useState(jobInfo)

    const onChange = (e) => setJobState({ ...jobState, [e.target.name]: e.target.value })

    const [jobType, setJobType] = useState(jobTypeInfo)

    const onJobType = (e) => setJobType({ ...jobType, [e.target.name]: e.target.value })

  const handleDelete = async (e) => {
    e.preventDefault()
        const { job_id } = job
          setLoading(true)
          const response = await Queries.deleteJob(job_id)
      await setUser({
        ...user,
        showToast: true,
        toastMessage: 'Your job has been deleted successfully.',
        currentUserJobs: user.currentUserJobs.filter(job => job.job_id !== response.job.job_id)
      })
          setLoading(false)
          closeModal()
  };

  const handleExit = (e) => {
    setViewState((prevState) => ({ ...prevState, view: true, edit: false }));
  };

  return (
    <div className=''>
    <div className="flex justify-center items-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Delete Job</h1>
    </div>
            {loading ? (
                <div className='flex justify-center items-center pt-[40px] pb-[40px]'>
       <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
      <form onSubmit={handleDelete}>
        <div className='flex flex-col items-center'>
          <h1
            name="jobSummary"
            className={`block w-full px-3 bg-white text-red-600 text-center`}
          >
          {'Are you sure you want to delete this job: '} <span className='text-black'>{job.job_title}</span>{' at '} <span className='text-black'>{job.job_company}</span>{'.'}</h1>
        <h1
            name="jobSummary"
            className={`mb-9 block w-full px-3 bg-white text-red-600 text-center`}
          >
          {'This action is irreversible and the item will be permanently removed from the system. Please confirm your decision.'}</h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <button 
          type="submit"
          className='col-span-2 bg-red-600 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Yes</button>
        <button 
          type="button"
          onClick={e => handleExit(e)}
          className='col-span-2 bg-gray-900 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >No</button>
        </div>
      </form>)}
    </div>
  )
}

export default DeleteJob