import { Fragment } from 'react'
import HeroSection from '../landingpage/HeroSection.jsx'
// import Stats from '../landingpage/Stats.jsx'
// import Testimonials from '../landingpage/Testimonials.jsx'
// import CallToAction from '../landingpage/CallToAction.jsx'
// import Blog from '../landingpage/Blog.jsx'
import AppFooter from '../landingpage/AppFooter'
import { userState } from '../main.jsx'
import { Navigate } from 'react-router-dom'

const App = () => {
  const { user } = userState()
  const isAuthenticated = user.isAuthenticated
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  }
  return (
    <Fragment>
      <HeroSection />
      {/* <Features /> */}
      {/* <Stats/>
        <Testimonials/>
        <CallToAction/>
        <Blog/> */}
      <AppFooter />
    </Fragment>
  )
}

export default App