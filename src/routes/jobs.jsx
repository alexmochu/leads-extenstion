import { useState, useEffect } from 'react'
import Queries from '../api/queries';
import { Tooltip } from 'react-tooltip'
import { Link } from 'react-router-dom'
import {userState } from '../main'
import ViewJobModal from '../tracker/viewJobModalComponents/viewJobModal';
import JobsTracker from './jobsTracker';

// import { browser } from 'webextension-polyfill-ts';

const jobDetails = {
  jobUrl: '',
  jobSummary: '',
  jobTitle: '',
  jobCompany: ''
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

function Jobs() {
  const [jobData, setJobData] = useState(jobDetails)
  const [error, setError] = useState('')
  const { user, setUser } = userState()
  const {id, currentUserJobs} = user
  const [data, setData] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrack, setIsTrack] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isTrackJob, setIsTrackJob] = useState(false);
  const [applicationState, setApplicationState] = useState('')
  const [bookmarkedOpenStates, setBookmarkedOpenStates] = useState([]);
  const [appliedOpenStates, setAppliedOpenStates] = useState([]);
  const [callsOpenStates, setCallsOpenStates] = useState([]);
  const [interviewOpenStates, setInterviewOpenStates] = useState([]);
  const [offerOpenStates, setOfferOpenStates] = useState([]);
  const [rejectedOpenStates, setRejectedOpenStates] = useState([]);


  const [loading, setLoading] = useState(true)
  const [loadingList, setLoadingList] = useState(false)

  async function loader() {
    const response = await Queries.getCurrentUserJobs(id)
    return response
  }

  const openModal = (item) => {
    setData(item)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setData({})
    setIsModalOpen(false);
  };

  const closeTrack = () => {
    setIsTrack(false);
  };

  const openTrack = () => {
    setIsTrack(true);
  };

const toggleDropdown = (index, jobState) => {
  if (jobState === 'bookmarked') {
    setAppliedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setCallsOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setInterviewOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setOfferOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setRejectedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  } else if (jobState === 'applied') {
    setBookmarkedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setCallsOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setInterviewOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
     setOfferOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
      setRejectedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  }else if (jobState === 'calls') {
    setBookmarkedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setAppliedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setInterviewOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
     setOfferOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
      setRejectedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  }else if (jobState === 'interview') {
    setBookmarkedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setCallsOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setAppliedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
     setOfferOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
      setRejectedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  }else if (jobState === 'offer') {
    setBookmarkedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setCallsOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setInterviewOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
     setAppliedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
      setRejectedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  } else if (jobState === 'rejected') {
    setBookmarkedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setCallsOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
    setInterviewOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
     setOfferOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
      setAppliedOpenStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });
  } 

   if (jobState === 'bookmarked') {
      setBookmarkedOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    } else if (jobState === 'applied') {
      setAppliedOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    } else if (jobState === 'calls') {
      setCallsOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    } else if (jobState === 'interview') {
      setInterviewOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    } else if (jobState === 'offer') {
      setOfferOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    } else if (jobState === 'rejected') {
      setRejectedOpenStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[index] = !updatedStates[index];
        return updatedStates;
      });
    }
  };

    const handleUpdate = async (e, item, state, index) => {
    e.preventDefault()
    // Handle form submission here
      setLoadingList(true)
      const response = await Queries.updateJob({...item, application_state: state})
      await setUser(prevState => ({
      ...prevState,
      currentUserJobs: prevState.currentUserJobs.map(job => {
        if (job.job_id === response.job.job_id) {
          return { ...job, ...response.job };
        }
        return job;
      })
    }))
      setLoadingList(false)
            // toggleDropdown(index, state)

      // Reset form
    }

  useEffect(() => {
    const storeState = localStorage.getItem('store')
      if (storeState) {
        setUser(JSON.parse(storeState))
    }
    const fetchData = async () => {
      try {
        const response = await loader()
        setUser((prevState) => ({ ...prevState, currentUserJobs: response.jobs  }));
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    setTimeout(() => {
      fetchData()
    }, 2000);

    // fetchData()
  }, [])


  const application_state = (job_state) => {
    if(job_state === 'bookmarked'){
      return "Bookmarked"
    } else if (job_state === 'applied'){
      return "Applied"
    } else if (job_state === 'calls'){
      return "First Calls"
    } else if(job_state === 'interview'){
      return "Fnl. Interview"
    } else if(job_state === 'offer'){
      return "Offer"
    } else if(job_state === 'rejected'){
      return 'Rejected'
    }
  }

  const getColorClasses = (jobState) => {
    switch (jobState) {
      case 'bookmarked':
        return 'bg-red-100 bg-opacity-80 text-gray-900';
      case 'applied':
        return 'bg-blue-100 bg-opacity-80 text-gray-900';
      case 'calls':
        return 'bg-yellow-100 bg-opacity-80 text-gray-900';
      case 'interview':
        return 'bg-green-100 bg-opacity-80 text-gray-900';
      case 'offer':
        return 'bg-purple-100 bg-opacity-80 text-gray-900';
      case 'rejected':
        return 'bg-indigo-100 bg-opacity-80 text-gray-900';
      default:
        return '';
    }
  };

  return (
    <>
    <div className="grid grid-cols-4 gap-4 mb-4">
      <h1 className="col-span-2 text-4xl font-bold tracking-tight text-gray-900">Jobs</h1>
      <button 
            type="button"
            onClick={openTrack}
            style={{ justifySelf: 'end' }}
            className='col-span-2 bg-gray-900 text-gray-100 w-fit pl-2 pr-2 rounded-md tracking-wide
                                      font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                      shadow-lg justify-end'            
            >+ Track Job</button>
    </div>
            <div className='w-full'>
          {currentUserJobs.length > 0 ? (
          currentUserJobs.map((item, index) => (
          <div key={item.id} className='rounded-2xl p-5 my-3 border bg-gray-50 h-30'>
            <div className='grid grid-cols-2 gap-4 mb-2'>
              <div>
            <h2 className='text-xl font-bold mb-2'>{item.job_company}</h2>
            <p className='mb-4 text-gray-500 text-lg'>{item.job_title}</p>
            </div>

    <div className='text-right'>
      {/* Icon elements */}
      <span className={`border px-6 pl-8 py-2 w-24 ${getColorClasses(item.application_state)} border-gray-900 rounded-3xl`} >{application_state(item.application_state)}</span>
      <div className='flex items-center justify-end text-right mt-4'>
        <h1 className='flex flex-row appearance-none bg-transparent' name='country' id='locations' value={item.job_location}>
          <span className='pr-3'>{item.job_location}</span>
          {LocationIcon}
        </h1>
      </div>
      <div className='flex justify-end text-right mt-4'>
        <h1 className='flex flex-row appearance-none bg-transparent' name='type' id='type' value={item.job_type}>
          <span className='pr-3'>{item.job_type}</span>
          {JobTypeIcon} 
        </h1>
      </div>
    </div>

            </div>
            {/* <div className='grid grid-cols-2 gap-4 mb-2'>
              <span className='bg-indigo-500 px-6 pl-8 py-2 w-fit text-white rounded-3xl' onClick={() => openModal(item)}>View</span>
              <div className='text-right'>
                <h6 className='text-lg font-medium flex justify-end text-gray-700 dark:text-white items-center'>
                  <svg 
                     className={`mt-2 ${isOpen ? 'text-indigo-500' : 'text-gray-500'}`}
                     onClick={() => toggleDropdown(index, 'bookmarked')}
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="4" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="20" r="2" />
                  </svg>
                </h6>
                {bookmarkedOpenStates[index] && (
                  <div className="absolute flex justify-start bg-gray-50 rounded-lg shadow-md mt-4 py-2">
                    {loadingList ? (
                <div className='flex justify-center items-center pt-[50px] pb-[50px] w-36'>
       <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600'></div>
                </div>
              ) : (
                    <ul className="pl-2 pr-2">
                      <li className="hover:bg-white hover:text-gray-700 w-28 text-left h-8 border-b-2 mb-2" onClick={(e) => handleUpdate(e, item, 'applied', index)}>Applied</li>
                      <li className="hover:bg-white hover:text-gray-700 w-28 text-left h-8 border-b-2 mb-2" onClick={(e) => handleUpdate(e, item, 'calls', index)}>First Calls</li>
                      <li className="hover:bg-white hover:text-gray-700 w-28 text-left h-8 border-b-2 mb-2" onClick={(e) => handleUpdate(e, item, 'interview', index)}>Final Interview</li>
                      <li className="hover:bg-white hover:text-gray-700 w-28 text-left h-8 border-b-2 mb-2" onClick={(e) => handleUpdate(e, item, 'offer', index)}>Offer</li>
                      <li className="hover:bg-white hover:text-gray-700 w-28 text-left h-8 border-b-2 mb-2" onClick={(e) => handleUpdate(e, item, 'rejected', index)}>Rejected</li>
                    </ul>)}
                  </div>
                )}
              </div>
            </div> */}
          </div>))) : null}
        </div>
        {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          <div className='relative bg-white p-8 rounded-lg shadow-md w-[600px]'>
            <button className='absolute top-2 right-2 text-gray-500' onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M18 6L6 18M6 6l12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Add your modal content here */}
            <ViewJobModal job={data} closeModal={closeModal}/>
          </div>
        </div>
      )}
      {isTrack && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
          <div className='relative bg-white p-8 rounded-lg shadow-md w-[600px]'>
            <button className='absolute top-2 right-2 text-gray-500' onClick={closeTrack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M18 6L6 18M6 6l12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Add your modal content here */}
            <JobsTracker closeTrack={closeTrack}/>
          </div>
        </div>
      )}
    </>
  )
}

export default Jobs