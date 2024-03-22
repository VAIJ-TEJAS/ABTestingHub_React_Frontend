import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
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

function App() {

  const { userAuthenticated } = Context();

  return (
    <>
      <Router>
        <Navbar />
        <Auth/>
        <Routes>
          <Route path="/" element={<Navigate to={"home"} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/articles" element={<ArticlesHome />} />
          <Route path="/articles/:category_name" element={<Categories />} />
          <Route path="/article/:article_id" element={<Article />} />
          <Route path="/ab-testing/" element={<ABTesting />} />
          <Route path="/continuous-metric-testing/" element={<ContinuousMetricTesting />} />
          <Route path="/proportional-metric-testing/" element={<ProportionalMetricTesting />} />
          {userAuthenticated ? (
            <>
              <Route path="/create-test/" element={<CreateTest />} />
              <Route path="/dashboard/" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route path="/create-test/" element={<Navigate to={"/home"} />} />
              <Route path="/dashboard/" element={<Navigate to={"/home"} />} />
            </>
          )}
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
