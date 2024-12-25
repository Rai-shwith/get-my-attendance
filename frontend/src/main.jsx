import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* <div className='bg-gradient-to-r from-blue-500 to-purple-600'> */}
  <div className='bg-gradient-to-r from-gray-800 to-gray-900'>
    <App />
    </div>
  </StrictMode>,
)
