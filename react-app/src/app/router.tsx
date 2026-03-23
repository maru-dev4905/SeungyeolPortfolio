import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '../components/layout/AppLayout'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { HomePage } from '../pages/HomePage'
import { WorkDetailPage } from '../pages/WorkDetailPage'
import { WorksPage } from '../pages/WorksPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'works', element: <WorksPage /> },
      { path: 'works/:projectSlug', element: <WorkDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])
