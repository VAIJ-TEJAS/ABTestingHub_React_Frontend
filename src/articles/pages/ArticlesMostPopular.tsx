import { Container } from "@mui/material";
import { ArticleCard } from "../components/ArticleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pagination } from "antd";

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

export const MostPopular = () => {
  const { category_name } = useParams();

  const [articles, setArticles] = useState<ArticleCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
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
        setArticles(sortedArticles);
      });
  }, [category_name]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <>
      <Container className="py-16 space-y-16">
        <div className="">
          <div className="text-4xl text-center">MOST POPULAR</div>
        </div>
        <div>
          {articles && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
              {currentArticles.length > 0 ? (
                currentArticles.map((props) => {
                  return <ArticleCard key={props.id} {...props} />;
                })
              ) : (
                <p className="text-center">No articles found</p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={articles.length}
            pageSize={articlesPerPage}
            onChange={handlePageChange}
          />
        </div>
      </Container>
    </>
  );
};
