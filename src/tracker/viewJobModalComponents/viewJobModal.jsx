import { useState } from 'react'
import ViewJob from './viewJob'
import EditJob from './editJob'
import DeleteJob from './deleteJob'

const state = {
  view: true,
  edit: false,
  // delete: true
}

function ViewJobModal({job, closeModal}) {
  const [viewState, setViewState] = useState(state)
  const {view, edit} = viewState

  return (
    <>
      {view ? 
        <ViewJob
          setViewState={setViewState}
          job={job}/> : 
      edit ? 
        <EditJob 
          setViewState={setViewState}
          job={job}
          closeModal={closeModal}/>: 
        <DeleteJob 
          setViewState={setViewState}
          job={job}
          closeModal={closeModal}/>}
    </>
  )
}

export default ViewJobModal