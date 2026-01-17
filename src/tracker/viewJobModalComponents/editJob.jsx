/* eslint-disable camelcase */
import { useState } from 'react'
import { countries } from '../../countries'
import { jobTypes } from '../../jobTypes'
import Queries from '../../api/queries'
import { userState } from '../../main'

const jobDetails = {
  job_url: '',
  job_description: '',
  job_title: '',
  job_company: '',
  application_state: '',
  job_type: '',
  job_location: ''
}

function EditJob({setViewState, job, closeModal}) {
  const { user, setUser } = userState()

  const [jobData, setJobData] = useState(job)
  const [error, setError] = useState(jobDetails)

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { job_title, job_company } = jobData
    if (job_title.trim() === '') {
      setError({ ...error, job_title: 'Job title can\'t be blank' })
    } else if (job_company.trim() === '') {
      setError({ ...error, job_company: 'Job company can\'t be blank' })
    } else {
      // Handle form submission here
      setLoading(true)
      const response = await Queries.updateJob(jobData)
      await setUser(prevState => ({
      ...prevState,
      showToast: true,
      toastMessage: 'Your job has been updated successfully.',
      currentUserJobs: prevState.currentUserJobs.map(job => {
        if (job.job_id === response.job.job_id) {
          return { ...job, ...response.job };
        }
        return job;
      })
    }))
      setLoading(false)
      closeModal()

      // Reset form
      setError(jobDetails)
    }  
  };

  const handleExit = (e) => {
    setViewState((prevState) => ({ ...prevState, view: true, edit: false }));
  };


  return (
    <div className='h-[500px]'>
    <div className="flex justify-center items-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Edit Job</h1>
    </div>

    {loading ? (
                <div className='flex justify-center items-center pt-[200px]'>
       <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="job_url"
            value={jobData.job_url}
            onChange={handleChange}
            placeholder="Enter job posting url"
            className={`col-span-4 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500  ${
                              error ? 'border-red-500' : ''
                            }`}
          />
        </div>
        <div>
          <input
            name="job_title"
            value={jobData.job_title}
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
            name="job_company"
            value={jobData.job_company}
            onChange={handleChange}
            placeholder="Enter job company"
            className={`mt-1 mb-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                            invalid:border-pink-500 invalid:text-pink-600
                            focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
        <select
          className={`col-span-2 pl-2 appearance-none bg-transparent border border-slate-300 rounded-md focus:outline-none select-no-outline`}
          name='job_location'
          id='locations'
          value={jobData.job_location}
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
          name='job_type'
          id='type'
          value={jobData.job_type}
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
            name="job_description"
            value={jobData.job_description}
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
          type="submit"
          className='col-span-2 bg-indigo-500 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Update</button>
        <button 
          type="button"
          onClick={e => handleExit(e)}
          className='col-span-2 bg-gray-900 text-gray-100 pt-2 pb-2 w-full rounded-full tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg'          
        >Exit</button>
        </div>
      </form>)}
    </div>
  )
}

export default EditJob