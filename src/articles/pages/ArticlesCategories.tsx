import { Container } from "@mui/material";
import { ArticleCard } from "../components/ArticleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ArticlesCategoryCard from "../components/ArticlesCategoryCard";

interface ArticalCardProps {
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

export const Categories = () => {
  const { category_name } = useParams();

  const [articles, setArticles] = useState<ArticalCardProps[]>([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/articles-card/?category__name=${category_name}`
      )
      .then((articles) => {
        setArticles(articles.data);
      });
  }, [category_name]);

  return (
    <>
      <Container>
        <div className="flex justify-between items-center my-8">
          <div className="text-6xl font-medium">Newsletters</div>
        </div>
        <ArticlesCategoryCard />
        <hr className="my-8" />
        {articles.length!==0 ?<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
          {articles?.map((props) => {
            return <ArticleCard key={props.id} {...props} />;
          })}
        </div>: <p className="text-center">No categories in this category</p> }
        <hr className="my-8" />
      </Container>
    </>
  );
};
