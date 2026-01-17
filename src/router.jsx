import {
  createBrowserRouter,
  // RouterProvider,
  // createRoutesFromElements,
  // Routes,
  // Route,
} from 'react-router-dom'
import Root from './routes/root'
import ErrorPage from './error-page'
// import Contact, { loader as contactLoader, action as contactAction } from './routes/contact'
// import EditContact, { action as editAction } from './routes/edit'

import App from './routes/App'
// import Index from './routes/index.jsx'
import Settings from './routes/settings.jsx'
import Profile from './routes/profile.jsx'
// import QA from './routes/qa.jsx'
// import CoverLetter from './routes/coverletter.jsx'
// import Resume from './routes/resume.jsx'
import Login from './routes/login.jsx'
import SignUp from './routes/signup.jsx'
// import Pricing from './routes/pricing'
import FaqS from './routes/faqs.jsx'
// import PrivacyPolicy from './routes/privacyPolicy.jsx'
// import ContactUs from './routes/contactUs.jsx'
// import TermsConditions from './routes/termsConditions.jsx'
// import Employers from './routes/employers'
import ForgotPassword from './routes/forgot-password.jsx'
import ProtectedRoute from './routes/protectedRoute'
import ChangePassword from './routes/changePassword'
// import { navigation as Navs } from './constants'
import Dashboard from './routes/dashboard.jsx'
import RootDashboard from './routes/rootDashboard'
// import Jobs from './routes/jobs.jsx'
// import JobsDashboard from './routes/jobsDashboard'
import Jobs from './routes/jobs'
import ConfirmEmail from './routes/confirmEmail'
import ForgotPasswordVerify from './routes/forgot-password-verify.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'index.html',
        element: <App />, 
      },
      // {
      //   path: '/jobs',
      //   element: <Jobs />,
      //   errorElement: <ErrorPage />,
      // },
      {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
        // action: loginAction,
      },
      // {
      //   path: 'employers',
      //   element: <Employers />,
      //   errorElement: <ErrorPage />,
      // },
      // {
      //   path: 'pricing',
      //   element: <Pricing />,
      //   errorElement: <ErrorPage />,
      // },
      {
        path: 'faqs',
        element: <FaqS />,
        errorElement: <ErrorPage />,
      },
    //   {
    //     path: 'privacy-policy',
    //     element: <PrivacyPolicy />,
    //     errorElement: <ErrorPage />,
    //   },
    //   {
    //     path: 'terms-conditions',
    //     element: <TermsConditions />,
    //     errorElement: <ErrorPage />,
    //   },
    //   {
    //     path: 'contact-us',
    //     element: <ContactUs />,
    //     errorElement: <ErrorPage />,
    //   },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <RootDashboard />{' '}
          </ProtectedRoute>
        ),
        children: 
        [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Dashboard />{' '}
              </ProtectedRoute>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <Profile />{' '}
              </ProtectedRoute>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'jobs',
            element: (
              <ProtectedRoute>
                <Jobs/>{' '}
              </ProtectedRoute>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <Settings />{' '}
              </ProtectedRoute>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'change-password',
            element: (
              <ProtectedRoute>
                <ChangePassword />{' '}
              </ProtectedRoute>
            ),
            errorElement: <ErrorPage />,
          },
        //   {
        //     path: 'qa',
        //     element: (
        //       <ProtectedRoute>
        //         <QA />{' '}
        //       </ProtectedRoute>
        //     ),
        //     errorElement: <ErrorPage />,
        //   },
        //   {
        //     path: 'cover-letter',
        //     element: (
        //       <ProtectedRoute>
        //         <CoverLetter />{' '}
        //       </ProtectedRoute>
        //     ),
        //     errorElement: <ErrorPage />,
        //   },
        //   {
        //     path: 'resume',
        //     element: (
        //       <ProtectedRoute>
        //         <Resume />{' '}
        //       </ProtectedRoute>
        //     ),
        //     errorElement: <ErrorPage />,
        //   },
        ],
      },
      {
        path: 'signup',
        element: <SignUp />,
        errorElement: <ErrorPage />,
        // action: signupAction
      },

      {
        path: 'forgot-password',
        element: <ForgotPassword />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'verify-email/:id',
        element: <ConfirmEmail />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'forgot-password/:id',
        element: <ForgotPasswordVerify />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

export default router