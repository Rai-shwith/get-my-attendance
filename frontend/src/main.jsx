import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <div className='bg-gradient-to-r from-blue-500 dark:from-gray-800 to-purple-600 dark:to-gray-900'>
  {/* <div className='bg-gradient-to-r from-gray-800 to-gray-900'> */}
    <ThemeToggle />
    <App />
    </div>
  </StrictMode>,
)
