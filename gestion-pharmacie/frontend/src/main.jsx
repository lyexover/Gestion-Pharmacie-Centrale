import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import './index.css'
import Auth from './Auth'

const router = createBrowserRouter([
  {
    index: true, 
    element : <Auth />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
