import { useState } from 'react'
import { countries } from '../../countries'
import { jobTypes } from '../../jobTypes'

const jobDetails = {
  jobUrl: 'www.job.com',
  jobSummary: 'This is a job summary',
  jobTitle: 'Software Engineer',
  jobCompany: 'Job Company Ltd'
}

const jobInfo = {
  title: 'Kenya',
  country: 'Kenya',
  type: 'Kenya',
}

const jobTypeInfo = {
    type: 'Remote'
}

const LocationIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
  <circle cx="12" cy="12" r="10"></circle>
  <g transform="translate(9 6)">
    <circle cx="2" cy="2" r="2"></circle>
    <path d="M0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6" strokeLinecap="round" strokeLinejoin="round"></path>
  </g>
</svg>

const JobTypeIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
  <path d="M12 22s-8-5.5-8-12a8 8 0 1 1 16 0c0 6.5-8 12-8 12z"></path>
  <circle cx="12" cy="10" r="3"></circle>
</svg>

function ViewJob({setViewState, job}) {
  const [jobData, setJobData] = useState(jobDetails)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    setJobData(jobDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = (e) => {
    setViewState((prevState) => ({ ...prevState, view: false, edit: true }));
  };

  const handleDelete = (e) => {
    setViewState((prevState) => ({ ...prevState, view: false, edit: false }));
  };



    const [jobState, setJobState] = useState(jobInfo)

    const onChange = (e) => setJobState({ ...jobState, [e.target.name]: e.target.value })

    const [jobType, setJobType] = useState(jobTypeInfo)

    const onJobType = (e) => setJobType({ ...jobType, [e.target.name]: e.target.value })

  return (
    <>
    <div className="flex justify-center items-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Job Detals</h1>
    </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <span className='block text-left text-sm font-medium text-slate-700'>
            Job Url
        </span> 
          <h1
            name="jobUrl"
            placeholder="Enter job posting url"
            className={`col-span-4 py-2 bg-white w-[300px] placeholder-slate-400  overflow-hidden whitespace-nowrap overflow-ellipsis`}
          >
            {job.job_url}
          </h1>
        </div>
        <div>
        <span className='block text-left text-sm font-medium text-slate-700'>
            Job Title
        </span> 
          <h1
            name="jobTitle"
            placeholder="Enter job title"
            className={`mb-4 block w-full py-2`}
          >
            {job.job_title}
        </h1>
        </div>
        <div>
        <span className='block text-left text-sm font-medium text-slate-700'>
            Job Company
        </span> 
          <h1
            name="jobCompany"
            placeholder="Enter job company"
            className={`mb-4 block w-full py-2 bg-white`}
          >
            {job.job_company}
            </h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <h1
          className='flex flex-row col-span-2 appearance-none bg-transparent'
          name='country'
          id='locations'
          value={jobState.country}
        >
          {LocationIcon}
          <span className="ml-1">{job.job_location}</span>
        </h1>
                <h1
          className='flex flex-row col-span-2 appearance-none bg-transparent'
          name='type'
          id='type'
          value={jobType.type}
        >
          {JobTypeIcon} 
          <span className="ml-1">{job.job_type}</span>
        </h1>
        </div>
        <div>
          <p
            name="jobSummary"
            placeholder="Enter job summary"
            className={`mt-1 mb-4 h-48 overflow-auto block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  whitespace-normal`}
          >
            {job.job_description}
        </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <button 
          type="button"
          onClick={e => handleEdit(e)}
          className='col-span-2 bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Edit</button>
        <button 
          type="button"
          onClick={e => handleDelete(e)}
          className='col-span-2 bg-red-600 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Delete</button>
        </div>
      </form>
    </>
  )
}

export default ViewJob