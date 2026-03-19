import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Blog from './pages/Blog';
import CvAnalysis from './pages/CvAnalysis';
import AdminUsers from './pages/Dashboard/AdminUsers';
import Dashboard from './pages/Dashboard/Dashboard';
import DashHome from './pages/Dashboard/DashHome';
import Notifications from './pages/Dashboard/Notifications';
import PastCvEvaluator from './pages/Dashboard/PastCvEvaluator';
import PastMockInterview from './pages/Dashboard/PastMockInterview';
import Profile from './pages/Dashboard/Profile';
import WebScrape from './pages/Dashboard/WebScrape';
import EducationBackground from './pages/EducationBackground';
import Forgot from './pages/ForgotPassword';
import HomePage from './pages/Home';
import InterestsSelection from './pages/InterestsSelection';
import JobDescription from './pages/JobDescription';
import JobFinder from './pages/JobFinder';
import LocationPreferences from './pages/LocationPreferences';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import MockInterview from './pages/MockInterview';
import ResetPassword from './pages/ResetPassword';
import Resources from './pages/Resources';
import SampleCVs from './pages/SampleCvs';
import Signup from './pages/Signup';
import VisaSelection from './pages/VisaSelection';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Public Pages with MainLayout */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/job-search" element={<JobFinder />} />
              <Route path="/job-search/more" element={<JobDescription />} />
              <Route path="/cv-analysis" element={<CvAnalysis />} />
              <Route path="/sample-cv" element={<SampleCVs />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/blogs" element={<Blog />} />
            </Routes>
          </MainLayout>
        } />

        {/* Protected Onboarding Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/signup/step-1" element={<VisaSelection />} />
          <Route path="/signup/step-2" element={<EducationBackground />} />
          <Route path="/signup/step-3" element={<InterestsSelection />} />
          <Route path="/signup/step-4" element={<LocationPreferences />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashHome />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="cv-evaluator" element={<PastCvEvaluator />} />
            <Route path="mock-interview" element={<PastMockInterview />} />
            <Route path="web-scrape" element={<WebScrape />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;