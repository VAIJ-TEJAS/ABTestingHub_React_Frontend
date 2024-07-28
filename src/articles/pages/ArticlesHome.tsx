/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@mui/material";
import { ArticleCard } from "../components/ArticleCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleHome from "../../assets/images/ArticleHome.png";
import DownArrow from "../../assets/svgs/DownArrow.svg";
import { Select } from "antd";

const { Option } = Select;

interface ArticleCardProps {
  id?: number;
  title?: string;
  short_description?: string;
  published_date?: string;
  popular_article?: boolean;
  featured_article?: boolean;
  cover_image?: {
    id: number;
    image: string;
  };
  category?: {
    id: number;
    name: string;
  };
  author?: {
    id: number;
    name: string;
    picture: string;
    role: string;
  };
}

interface ArticlesDataProps {
  articles: ArticleCardProps[];
  popularArticles: ArticleCardProps[];
  featuredArticle: ArticleCardProps;
}

export const ArticlesHome = () => {
  const navigate = useNavigate();

  const [articleCategories, setArticleCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const [articlesData, setArticlesData] = useState<ArticlesDataProps>({
    articles: [],
    featuredArticle: {},
    popularArticles: [],
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleCardProps[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/categories/`)
      .then((categories) => {
        setArticleCategories(categories.data);
      });

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/articles-card/`)
      .then((response) => {
        const sortedArticles = response.data.sort(
          (a: ArticleCardProps, b: ArticleCardProps) => {
            const dateA = new Date(a.published_date ?? 0).getTime();
            const dateB = new Date(b.published_date ?? 0).getTime();
            return dateB - dateA;
          }
        );
        const popularArticles = sortedArticles.filter(
          (article: ArticleCardProps) => article.popular_article
        );

        setArticlesData({
          articles: sortedArticles,
          featuredArticle: sortedArticles[0],
          popularArticles: popularArticles,
        });
      });
  }, []);

  useEffect(() => {
    setFilteredArticles(
      articlesData.articles.filter(
        (article) =>
          selectedCategories.includes(article.category?.name ?? "")
      )
    );
  }, [selectedCategories, articlesData.articles]);

  const handleCategoryChange = (value: any) => {
    setSelectedCategories(value);
  };

  return (
    <>
      <div
        style={{ background: `url(${ArticleHome})` }}
        className="flex justify-center"
      >
        <Container className="pt-16 pb-4">
          <div className="flex flex-col gap-8 text-white text-center">
            <div className="text-3xl lg:text-5xl">ARTICLES</div>
            <div>
              <div className="text-lg lg:text-2xl">
                Dive into expertly crafted articles and stay ahead in the world
                of AB testing. From foundational guides to advanced strategies,
                our insights are designed to help you optimize and succeed.
              </div>
              <div className="py-4">Explore, Learn, Apply</div>
            </div>
            <div className="w-full justify-center inline-flex gap-2 items-center">
              See Our Latest Articles{" "}
              <img src={DownArrow} className="w-3 animate-bounce" />
            </div>
          </div>
        </Container>
      </div>
      <Container className="py-16">
        <div className="space-y-4 p-5">
          <div className="text-4xl ">Search By Tags</div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select categories"
                onChange={handleCategoryChange}
                size="large"
                className="border border-black rounded"
              >
                {articleCategories.map((category) => (
                  <Option key={category.id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
            {filteredArticles.length > 0 && (
              filteredArticles.map((props) => <ArticleCard key={props.id} {...props} />)
            )}
          </div>
        </div>

        {articlesData.articles && (
          <div className="space-y-4 my-8">
            <div className="flex w-full justify-between items-end">
              <div className="text-4xl p-5">Latest Articles</div>
              <button
                className="text-xl p-5 text-primary hover:text-secondary"
                onClick={() => {
                  navigate("/articles-latest/");
                }}
              >
                Read More
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
              {articlesData.articles.slice(0, 3).length > 0 ? (
                articlesData.articles.slice(0, 3).map((props) => {
                  return <ArticleCard key={props.id} {...props} />;
                })
              ) : (
                <p className="text-center">No articles found</p>
              )}
            </div>
          </div>
        )}

        {articlesData.popularArticles && (
          <div className="space-y-4 my-8">
            <div className="flex w-full justify-between items-end">
              <div className="text-4xl p-5">Popular Articles</div>
              <button
                className="text-xl p-5 text-primary hover:text-secondary"
                onClick={() => {
                  navigate("/articles-most-popular/");
                }}
              >
                Read More
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
              {articlesData.popularArticles.slice(0, 3).length > 0 ? (
                articlesData.popularArticles.slice(0, 3).map((props) => {
                  return <ArticleCard key={props.id} {...props} />;
                })
              ) : (
                <p className="text-center">No articles found</p>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
