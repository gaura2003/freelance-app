import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

// Pages
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProjectDetails from "../pages/ProjectDetails.jsx";
import PostProject from "../pages/PostProject.jsx";
import FindProjects from "../pages/FindProjects.jsx";
// import MyProjects from "../pages/MyProjects.jsx";
import Proposals from "../pages/Proposals.jsx";
import Messages from "../pages/Messages.jsx";
import Notifications from "../pages/Notifications.jsx";
import Categories from "../pages/Categories.jsx";
// import CategoryDetails from "../pages/CategoryDetails.jsx";
import Network from "../pages/Network.jsx";
import Connections from "../pages/Connections.jsx";
// import UploadWork from "../pages/UploadWork.jsx";
// import Events from "../pages/Events.jsx";
// import FindFreelancers from "../pages/FindFreelancers.jsx";
// import HowItWorks from "../pages/HowItWorks.jsx";
import Help from "../pages/Help.jsx";
// import FAQ from "../pages/FAQ.jsx";
import Contact from "../pages/Contact.jsx";
// import Feedback from "../pages/Feedback.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx"
import Terms from "../pages/TermsOfService.jsx";
// import Cookies from "../pages/Cookies.jsx";
import NotFound from "../pages/NotFound.jsx";

// New membership-related imports
import Memberships from "../pages/Memberships.jsx";
import MembershipDetails from "../pages/MembershipDetails.jsx";
import MembershipCheckout from "../pages/MembershipCheckout.jsx";
import MembershipSuccess from "../pages/MembershipSuccess.jsx";
import MembershipManagement from "../pages/MembershipManagement.jsx";

// Trend Pages
import TrendRemoteWork from "../pages/trends/RemoteWork.jsx";
import TrendAITools from "../pages/trends/AITools.jsx";
import TrendFreelanceTips from "../pages/trends/FreelanceTips.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Project Routes */}
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/find-projects" element={<FindProjects />} />
        
        {/* Category Routes */}
        <Route path="/categories" element={<Categories />} />
        {/* <Route path="/categories/:id" element={<CategoryDetails />} /> */}
        
        {/* Trend Routes */}
        <Route path="/trends/remote-work" element={<TrendRemoteWork />} />
        <Route path="/trends/ai-tools" element={<TrendAITools />} />
        <Route path="/trends/freelance-tips" element={<TrendFreelanceTips />} />
        
        {/* Information Pages */}
        {/* <Route path="/how-it-works" element={<HowItWorks />} /> */}
        <Route path="/help" element={<Help />} />
        {/* <Route path="/faq" element={<FAQ />} /> */}
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/feedback" element={<Feedback />} /> */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        {/* <Route path="/cookies" element={<Cookies />} /> */}
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/post-project" element={
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        } />
        
        {/* <Route path="/my-projects" element={
          <ProtectedRoute>
            <MyProjects />
          </ProtectedRoute>
        } /> */}
        
        <Route path="/proposals" element={
          <ProtectedRoute>
            <Proposals />
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        <Route path="/network" element={
          <ProtectedRoute>
            <Network />
          </ProtectedRoute>
        } />
        
        <Route path="/connections" element={
          <ProtectedRoute>
            <Connections />
          </ProtectedRoute>
        } />
        
        {/* <Route path="/upload-work" element={
          <ProtectedRoute>
            <UploadWork />
          </ProtectedRoute>
        } /> */}
        
        {/* <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } /> */}
        
        {/* <Route path="/find-freelancers" element={
          <ProtectedRoute>
            <FindFreelancers />
          </ProtectedRoute>
        } /> */}

        
        {/* Membership Routes */}
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/memberships/:id" element={<MembershipDetails />} />
        <Route path="/membership-checkout/:id" element={<MembershipCheckout />} />
        <Route path="/membership-success" element={<MembershipSuccess />} />
        <Route path="/membership-management" element={<MembershipManagement />} />
      </Route>
      
      {/* Admin Routes with AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/*" element={
          <AdminRoute>
            <Routes>
              <Route path="dashboard" element={<div>Admin Dashboard</div>} />
              <Route path="users" element={<div>User Management</div>} />
              <Route path="projects" element={<div>Project Management</div>} />
              <Route path="categories" element={<div>Category Management</div>} />
              <Route path="reports" element={<div>Reports</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
            </Routes>
          </AdminRoute>
        } />
      </Route>
      
      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;


// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home.jsx";
// import Login from "../pages/Login.jsx";
// import Register from "../pages/Register.jsx";
// import Projects from "../pages/Projects.jsx";
// import ProjectDetails from "../pages/ProjectDetails.jsx";
// import Dashboard from "../pages/Dashboard.jsx";
// import ClientDashboard from "../pages/ClientDashboard.jsx";
// import AdminDashboard from "../pages/AdminDashboard.jsx";
// import Profile from "../pages/Profile.jsx";
// import Messages from "../pages/Messages.jsx";
// import Settings from "../pages/Settings.jsx";
// import Notifications from "../pages/Notifications.jsx";
// import ForgotPassword from "../pages/ForgotPassword.jsx";
// import ResetPassword from "../pages/ResetPassword.jsx";
// import VerifyEmail from "../pages/VerifyEmail.jsx";
// import FindProjects from "../pages/FindProjects.jsx";
// import ProjectApplication from "../pages/ProjectApplication";
// import PostProject from "../pages/PostProject";
// import Payments from "../pages/Payments.jsx";
// import PaymentHistory from "../pages/PaymentHistory.jsx";
// import Proposals from "../pages/Proposals.jsx";
// // New membership-related imports
// import Memberships from "../pages/Memberships.jsx";
// import MembershipDetails from "../pages/MembershipDetails.jsx";
// import MembershipCheckout from "../pages/MembershipCheckout.jsx";
// import MembershipSuccess from "../pages/MembershipSuccess.jsx";
// import MembershipManagement from "../pages/MembershipManagement.jsx";
// import SavedProjects from "../pages/SavedProjects.jsx";
// import EditProfile from "../pages/EditProfile.jsx";
// import ChangePassword from "../pages/ChangePassword.jsx";
// import NotFound from "../pages/NotFound.jsx";
// import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
// import TermsOfService from "../pages/TermsOfService.jsx";
// import Help from "../pages/Help.jsx";
// import Contact from "../pages/Contact.jsx";
// import About from "../pages/About.jsx";

// const AppRoutes = () => {
//   return (
//     <div className="mt-12">
//       <Routes>
//         {/* Main Pages */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
//         {/* Project Related */}
//         <Route path="/projects" element={<Projects />} />
//         <Route path="/projects/:id" element={<ProjectDetails />} />
//         <Route path="/projects/:projectId/apply" element={<ProjectApplication />} />
//         <Route path="/find-projects" element={<FindProjects/>}/>
//         <Route path="/post-project" element={<PostProject />} />
//         <Route path="/post" element={<PostProject />} />
//         <Route path="/saved-projects" element={<SavedProjects />} />
//         <Route path="/proposals" element={<Proposals />} />
        
//         {/* Dashboard */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/client/dashboard" element={<ClientDashboard />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
//         {/* User Related */}
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/profile/:username" element={<Profile />} />
//         <Route path="/profile/edit" element={<EditProfile />} />
//         <Route path="/change-password" element={<ChangePassword />} />
//         <Route path="/messages" element={<Messages />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/notification" element={<Notifications />} />
//         <Route path="/notifications" element={<Notifications />} />
        
//         {/* Authentication */}
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />
//         <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
//         {/* Payments */}
//         <Route path="/payments" element={<Payments />} />
//         <Route path="/payment-history" element={<PaymentHistory />} />
        
        // {/* Membership Routes */}
        // <Route path="/memberships" element={<Memberships />} />
        // <Route path="/memberships/:id" element={<MembershipDetails />} />
        // <Route path="/membership-checkout/:id" element={<MembershipCheckout />} />
        // <Route path="/membership-success" element={<MembershipSuccess />} />
        // <Route path="/membership-management" element={<MembershipManagement />} />
        
//         {/* Static Pages */}
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/help" element={<Help />} />
//         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//         <Route path="/terms-of-service" element={<TermsOfService />} />
        
//         {/* 404 Page */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// };

// export default AppRoutes;

