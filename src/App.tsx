import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { Categories } from "./articles/pages/ArticlesCategories";
import { ArticlesHome } from "./articles/pages/ArticlesHome";
import { Article } from "./articles/pages/Article";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";

function App() {

  return (
    <div className="">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to={"article/:article_id"} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/articles" element={<ArticlesHome />} />
          <Route path="/articles/:category_name" element={<Categories />} />
          <Route path="/article/:article_id" element={<Article />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
