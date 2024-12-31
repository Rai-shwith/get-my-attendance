import NotFound from "./pages/common/NotFound.jsx";
import LandingPage from "./pages/common/LandingPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/common/Signup.jsx";
import Login from "./pages/common/Login.jsx";
import HostHome from "./pages/host/hostHome.jsx";
import { AuthProvider } from "../api/authContext.jsx";
const AuthLayout = ({ children }) => <AuthProvider>{children}</AuthProvider>;
function App() {
  return (
    // <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
    //   <ThemeToggle />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/teacher/" element={<HostHome />} />
        </Route>
        <Route path="*" element={<NotFound />} />{" "}
        {/* Catch-all route for 404 */}
      </Routes>
    </Router>
    //   <p className="text-4xl font-bold text-center">Tailwind with React!</p>
    // </div>
  );
}

export default App;
