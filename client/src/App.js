import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Header from "./pages/Home/Header";  
import TopBar from "./pages/Home/TopBar";  
import Footer from "./pages/Home/Footer";

import Home from "./pages/Home/Home"; 
import ContactUs from "./pages/Home/ContactUs";
import AboutUs from "./pages/Home/AboutUs";
import Chatbot from "./pages/Home/Chatbot";

import RoleSelectionPage from "./pages/Login/RoleSelectionPage";
import DonorLogin from "./pages/Login/DonorLogin";
import NeedyLogin from "./pages/Login/NeedyLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import DonorSignup from "./pages/Login/DonorSignup";
import NeedySignup from "./pages/Login/NeedySignup";

import OAuthSuccess from "./pages/Login/OAuthSuccess";

import NewsStories from "./pages/Home/NewsStories";
import StoryDetail from "./pages/Home/StoryDetail";
import InProgressStoryDetails from "./pages/Home/InProgressStoryDetails";

import Donate from "./pages/Home/Donate";
import Payment from "./pages/Home/Payment";
import CreditPayment from "./pages/Home/CreditPayment";
import StripePayment from "./pages/Home/StripePayment";
import PaypalPayment from "./pages/Home/PaypalPayment";

// All Admin 
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StoryManagement from "./pages/Admin/StoryManagement";
import StoryView from "./pages/Admin/StoryView";
import UserManagement from "./pages/Admin/UserManagement";
import PaymentDonation from "./pages/Admin/PaymentDonation";
import ReportsFeedbacks from "./pages/Admin/ReportsFeedbacks";
import Settings from "./pages/Admin/Settings";
import Logout from "./pages/Admin/Logout";

// All Donor
import DonorLayout from "./layouts/DonorLayout";
import DonorDashboard from "./pages/Donor/DonorDashboard";
import DonationHistory from "./pages/Donor/DonationHistory";
import EditProfile from "./pages/Donor/EditProfile";
import DonorSettings from "./pages/Donor/DonorSettings";
import DonorLogout from "./pages/Donor/DonorLogout";

// All Needy
import NeedyLayout from "./layouts/NeedyLayout";
import NeedyDashboard from "./pages/Needy/NeedyDashboard";
import SubmitStory from "./pages/Needy/SubmitStory";
import MyStories from "./pages/Needy/MyStories";
import NeedyEditProfile from "./pages/Needy/NeedyEditProfile";
import NeedySettings from "./pages/Needy/NeedySettings";
import NeedyLogout from "./pages/Needy/NeedyLogout";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6a1b9a' },
    secondary: { main: '#ff4d6d' },
  },
  typography: { fontFamily: 'Segoe UI, sans-serif' },
});

function Layout() {
  const location = useLocation();

  // Hide footer on Admin or Donor pages
  const path = location.pathname.toLowerCase();
  const hideFooter =
    path.startsWith("/admin") || path.startsWith("/donor") || path.startsWith("/needy");

  return (
    <>
      <TopBar />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Login / Signup */}
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/login/donor" element={<DonorLogin />} />
        <Route path="/login/needy" element={<NeedyLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/donor/signup" element={<DonorSignup />} />
        <Route path="/needy/signup" element={<NeedySignup />} />

        {/* OAuth callback */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* General All pages */}
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/NewsStories" element={<NewsStories />} />
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/story/inprogress/:id" element={<InProgressStoryDetails />} />
        <Route path="/Donate" element={<Donate />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/pay/credit" element={<CreditPayment />} />
        <Route path="/pay/paypal" element={<PaypalPayment />} />
        <Route path="/pay/stripe" element={<StripePayment />} />
        

        {/* Admin pages inside layout */}
        <Route element={<AdminLayout />}>
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/Admin/story-management" element={<StoryManagement />} />
          <Route path="/Admin/story/view/:id" element={<StoryView />} />
          <Route path="/Admin/user-management" element={<UserManagement />} />
          <Route path="/Admin/payment-donation" element={<PaymentDonation />} />
          <Route path="/Admin/reports-feedbacks" element={<ReportsFeedbacks />} />
          <Route path="/Admin/settings" element={<Settings />} />
          <Route path="/Admin/logout" element={<Logout />} />
        </Route>

        {/* Donor pages inside layout */}
        <Route element={<DonorLayout />}>
          <Route path="/DonorDashboard" element={<DonorDashboard />} />
          <Route path="/Donor/NewsStories" element={<NewsStories />} />
          <Route path="/Donor/history" element={<DonationHistory />} />
          <Route path="/Donor/edit-profile" element={<EditProfile />} />
          <Route path="/Donor/settings" element={<DonorSettings />} />
          <Route path="/Donor/logout" element={<DonorLogout />} />
        </Route>

        {/* Needy pages inside layout */}
        <Route element={<NeedyLayout />}>
        <Route path="/NeedyDashboard" element={<NeedyDashboard />} />
        <Route path="/needy/mystories" element={<MyStories />} />
        <Route path="/needy/submit" element={<SubmitStory />} />
        <Route path="/needy/edit-profile" element={<NeedyEditProfile />} />
        <Route path="/needy/settings" element={<NeedySettings />} />
        <Route path="/needy/logout" element={<NeedyLogout />} />
      </Route>

      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;