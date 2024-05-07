/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@mui/material";
import { ArticleCard } from "../components/ArticleCard";
import { MostPopularArticleCard } from "../components/MostPopularArticleCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

interface ArticalsDataProps {
  articles: ArticalCardProps[];
  popularArticles: ArticalCardProps[];
  featuredArticle: ArticalCardProps;
}

export const ArticlesHome = () => {
  const [articlesData, setArticlesData] = useState<ArticalsDataProps>({
    articles: [],
    featuredArticle: {},
    popularArticles: [],
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/articles-card/`)
      .then((articles) => {
        setArticlesData({
          articles: articles.data,
          featuredArticle: articles.data[0],
          popularArticles: articles.data.filter(
            (article: any) => article.popular_article
          ),
        });
      });
  }, []);

  return (
    <>
      <Container>
        <div className="flex justify-between flex-wrap items-center my-8">
          <div className="text-6xl font-medium mb-4">Articles</div>
          <ArticlesCategoryCard />
        </div>

        <div className="flex gap-16 flex-col lg:flex-row">
          {articlesData.featuredArticle ? (
            <div className="flex-1 group">
              <Link
                to={`/article/${articlesData.featuredArticle.id}`}
                className="space-y-3 group-hover:cursor-pointer"
              >
                <div
                  style={{
                    backgroundImage: `url(${articlesData.featuredArticle?.cover_image?.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                  }}
                  className="h-96 group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200"
                >
                  IMG
                </div>
                <div className="text-5xl font-medium group-hover:text-primary transition-colors duration-200">
                  {articlesData.featuredArticle?.title}
                </div>
                <div className="text-zinc-500">
                  {articlesData.featuredArticle?.short_description}
                </div>
                <div className="py-3">
                  <div className="flex space-x-2 items-center">
                    <div className="flex gap-2">
                      <img
                        src={articlesData.featuredArticle.author?.picture}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      <div>
                        <div className="font-semibold">
                          {articlesData.featuredArticle.author?.name}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {articlesData.featuredArticle.author?.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <p className="w-96">No article featured</p>
          )}

          {articlesData.popularArticles && (
            <div className="space-y-4">
              <div className="text-4xl font-medium text-center">
                Most Popular
              </div>
              <div className="space-y-3 flex flex-wrap lg:flex-nowrap lg:flex-col items-center justify-center">
                {articlesData.popularArticles.length > 0 ? (
                  articlesData.popularArticles?.map((props) => {
                    return <MostPopularArticleCard key={props.id} {...props} />;
                  })
                ) : (
                  <p className="text-center">no articles found</p>
                )}
              </div>
            </div>
          )}
        </div>

        <hr className="my-8" />
        {articlesData.articles ? (
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8">
            {articlesData.articles.map((props) => {
              return <ArticleCard key={props.id} {...props} />;
            })}
          </div>
        ) : (
          <p className="text-center">no articles found</p>
        )}
        <hr className="my-8" />
      </Container>
    </>
  );
};
