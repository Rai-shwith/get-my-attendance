import ThemeToggle from './components/ThemeToggle';
import NotFound from './pages/common/NotFound.jsx';
import HostLandingPage from './pages/host/HostLandingPage.jsx';
import StudentLandingPage from './pages/student/StudentLandingPage.jsx';
import LandingPage from './pages/common/LandingPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/common/Signup.jsx';
import Login from './pages/common/Login.jsx';
import HostHome from './pages/host/HostHome.jsx';

function App() {
  return (
    // <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
    //   <ThemeToggle />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hostLanding" element={<HostLandingPage />} />
        <Route path='/host/' element={<HostHome />}/>
        <Route path="/studentLanding" element={<StudentLandingPage />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
    //   <p className="text-4xl font-bold text-center">Tailwind with React!</p>
    // </div>
  );
}

export default App;
