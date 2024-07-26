import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom"
import { Categories } from "./articles/pages/ArticlesCategories";
import { ArticlesHome } from "./articles/pages/ArticlesHome";
import { Article } from "./articles/pages/Article";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Context } from "./context/context.provider";
import { ABTesting } from "./pages/ABTesting";
import { CreateTest } from "./pages/CreateTest";
import { Dashboard } from "./pages/Dashboard";
import { ContinuousMetricTesting } from "./pages/ContinuousMetricTesting";
import { ProportionalMetricTesting } from "./pages/ProportionalMetricTesting";
import { Auth } from "./components/Auth";
import { DashboardNavbar } from "./components/DashboardNavbar";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { AboutUs } from "./pages/AboutUs";
import { CommunityAnalytics } from "./pages/CommunityAnalytics";

function App() {

  const { userAuthenticated } = Context();

  const Layout = () => {

    const location = useLocation();
    const noFooterRoutes = ['dashboard', 'create-test', 'ab-testing', 'continuous-metric-testing', 'proportional-metric-testing'];
    const showFooter = !noFooterRoutes.includes(location.pathname.split('/')[1]);
    
    const isDashboard = location.pathname.split('/')[1] === 'dashboard';
    const isCreateTest = location.pathname.split('/')[1] === 'create-test';

    return (
      <div className="">
        {
          userAuthenticated && isDashboard || isCreateTest ? (
            <>
              <DashboardNavbar />
            </>
          ) : (
            <>
              <Navbar />
            </>
          )
        }
        <Auth />
        <Routes>
          <Route path="/" element={<Navigate to={"home"} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/community-analytics" element={<CommunityAnalytics />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/articles" element={<ArticlesHome />} />
          <Route path="/articles/:category_name" element={<Categories />} />
          <Route path="/article/:article_id" element={<Article />} />
          <Route path="/ab-testing/" element={<ABTesting />} />
          <Route path="/continuous-metric-testing" element={<ContinuousMetricTesting />} />
          <Route path="/proportional-metric-testing" element={<ProportionalMetricTesting />} />
          {userAuthenticated ? (
            <>
              <Route path="/create-test" element={<CreateTest />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route path="/create-test" element={<Navigate to={"/home"} />} />
              <Route path="/dashboard" element={<Navigate to={"/home"} />} />
            </>
          )}
        </Routes>
        {showFooter && <Footer />}
      </div>
    );
  };

  return (
    <>
      <Router>
        <Layout />
      </Router>
    </>
  );
}

export default App;
