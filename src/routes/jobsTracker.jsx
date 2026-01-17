import { useState } from 'react'
import Queries from '../api/queries';
import { Tooltip } from 'react-tooltip'
import { userState } from '../main'
import { countries } from '../countries'
import { jobTypes } from '../jobTypes'
import { useNavigate } from 'react-router-dom'
import { browser } from 'webextension-polyfill-ts';

const jobDetails = {
  jobUrl: '',
  jobDescription: '',
  jobTitle: '',
  jobCompany: '',
  jobLocation: '',
  jobType: '',
  applicationState: 'bookmarked',
}

function JobsTracker({closeTrack}) {
  const [jobData, setJobData] = useState(jobDetails)
  const [error, setError] = useState(jobDetails)
  const [loading, setLoading] = useState(false)
  const {user, setUser} = userState()

  const handleJobSummary = async (e) => {
    e.preventDefault();
    await Queries.getJobSummary()
  };

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { jobTitle, jobCompany } = jobData
    if (jobTitle.trim() === '') {
      setError({ ...error, jobTitle: 'Job title can\'t be blank' })
    } else if (jobCompany.trim() === '') {
      setError({ ...error, jobCompany: 'Job company can\'t be blank' })
    } else {
      // Handle form submission here
      setLoading(true)
      const response = await Queries.createJob({...jobData})
      await setUser({
        ...user,
        showToast: true,
        toastMessage: 'Your job has been added successfully.',
        currentUserJobs: [
          response.job,
          ...user.currentUserJobs]
      })
      setLoading(false)

      // Reset form
      closeTrack()
      setJobData(jobDetails)
      setError(jobDetails)
    }    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFetchUrl = async (e) => {
    e.preventDefault();
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const url = currentTab.url;
    setJobData((prevState) => ({ ...prevState, jobUrl: url }));
  };

  return (
    <>
        <div className="grid grid-cols-4 gap-4 mb-4">
      <h1 className="col-span-3 text-4xl font-bold tracking-tight text-gray-900 mb-6">Track Job</h1>
    </div>
        {loading ? (
                <div className='flex justify-center items-center pt-[150px] pb-[170px]'>
       <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="jobUrl"
            value={jobData.jobUrl}
            onChange={handleChange}
            placeholder="Enter job posting url"
            className={`col-span-3 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error ? 'border-red-500' : ''
                            }`}
          />
          <button 
            type="button"
            onClick={handleFetchUrl}
            className='col-span-1 bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'            
            >Fetch Url</button>
        </div>
        <div>
          <input
            name="jobTitle"
            value={jobData.jobTitle}
            onChange={handleChange}
            placeholder="Enter job title"
            className={`mt-1 mb-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
          />
        </div>
        <div>
          <input
            name="jobCompany"
            value={jobData.jobCompany}
            onChange={handleChange}
            placeholder="Enter job company"
            className={`mt-1 mb-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-2">
        <select
          className={`col-span-2 pl-2 appearance-none bg-transparent border border-slate-300 rounded-md focus:outline-none select-no-outline`}
          name='jobLocation'
          id='locations'
          value={jobData.jobLocation}
          onChange={handleChange}
        >
            <option className='p-10' value='' disabled selected>
    Select a location
  </option>
          {countries.map((item) => (
            <option key={item.country_code} value={item.en_short_name}>
              {item.en_short_name}
            </option>
          ))}
        </select>
                <select
          className='col-span-2 pl-2 appearance-none bg-transparent border border-slate-300 rounded-md focus:outline-none select-no-outline'
          name='jobType'
          id='type'
          value={jobData.jobType}
          onChange={handleChange}
        >
            <option value='' disabled selected>
    Select job type
  </option>
          {jobTypes.map((item) => (
            <option key={item.type} value={item.type}>
              {item.type}
            </option>
          ))}
        </select>
        </div>
        <div>
          <textarea
            name="jobDescription"
            value={jobData.jobDescription}
            onChange={handleChange}
            placeholder="Enter job summary"
            className={`mt-1 mb-4 h-48 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
        <button 
          onClick={handleJobSummary}
          data-tooltip-id="my-tooltip" 
          data-tooltip-content="AI Solution coming soon!"
          data-tooltip-delay-hide={1000}
          className='col-span-2 bg-gray-900 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline
                                      shadow-lg'
          >Get Summary</button>
        <button 
          type="submit"
          className='col-span-2 bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Submit</button>
        </div>
        <Tooltip id="my-tooltip" />
      </form>)}
    </>
  )
}

export default JobsTracker