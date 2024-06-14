/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Paper } from "@mui/material";
import { Button } from "antd";
import HeroImage from "../assets/images/hero-image.webp";
import ContinuousMetricLogo from "../assets/images/ContinuousMetric.webp";
import ProportionalMetricLogo from "../assets/images/ProportionalMetric.webp";
import ABTestingLogo from "../assets/images/ABTesting.webp";
import { ArticleStripe } from "../articles/components/ArticleStripe";
import { useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../context/context.provider";
import { MostPopularArticleCard } from "../articles/components/MostPopularArticleCard";
import ArticlesCategoryCard from "../articles/components/ArticlesCategoryCard";
import { useLocation, useNavigate } from "react-router-dom";
import parse from 'html-react-parser';

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

export const Home = () => {
  const { showAuthModal, userAuthenticated } = Context();
  const navigate = useNavigate();
  const location = useLocation();
  const [articlesData, setArticlesData] = useState<ArticalCardProps[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/articles-card/`)
      .then((articles) => {
        setArticlesData(
          articles.data.filter((article: any) => article.popular_article)
        );
      });
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <>
      <div>
        {parse(``)}
      </div>
      <div>
        <Container className="relative flex flex-col lg:flex-row">
          <div className="space-y-8 py-16 ">
            <div className="text-4xl font-medium lg:text-left text-center lg:text-7xl sm:text-5xl">Stay curious.</div>
            <div className="text-xl mx-auto w-3/4 text-center lg:mx-0 lg:text-left sm:w-1/2 sm:text-2xl">
              Optimize Your Decisions: Uncover data-driven insights through
              controlled A/B testing and elevate your business strategy.
            </div>
            <div>
              {userAuthenticated ? (
                <Button
                  size="large"
                  type="primary"
                  className="hidden lg:inline-block lg:ml-auto px-6 font-bold  transition duration-200"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  size="large"
                  type="primary"
                  className="hidden lg:inline-block lg:ml-auto px-6 font-bold  transition duration-200"
                  onClick={showAuthModal}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>

          <img
            src={HeroImage}
            className="absolute right-1/2 translate-x-1/2 top-0 h-full -z-50 opacity-25 lg:opacity-100 lg:right-0 lg:translate-x-0"
          />
        </Container>
      </div>
      {/* Tools  */}
      <div id="tools-we-offer">
        <Container>
          <div className="gap-8 py-16">
            <div className="space-y-4">
              <div className="text-4xl font-medium py-8">Tools We Offer</div>
              <div className="flex flex-wrap justify-center gap-8">
                <div className=" border-primary border rounded-xl p-4">
                  <div className="pb-4 text-primary text-3xl font-mono">
                    MSS Tool
                  </div>
                  <div className="flex flex-wrap items-stretch justify-center gap-8">
                    <Paper
                      onClick={() => {
                        navigate("/continuous-metric-testing/");
                      }}
                      className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group"
                    >
                      <div>
                        <img src={ContinuousMetricLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          Continuous Metric Testing
                        </div>
                        <div className="text-zinc-500">
                          Measures how much of something there is, taking any
                          value on a scale (e.g., how long users watch a video
                          on average).
                        </div>
                      </div>
                    </Paper>

                    <Paper
                      onClick={() => {
                        navigate("/proportional-metric-testing/");
                      }}
                      className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group"
                    >
                      <div>
                        <img src={ProportionalMetricLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          Proportional metric Testing
                        </div>
                        <div className="text-zinc-500">
                          Represents a fraction of a whole, expressed as a
                          percentage or ratio (e.g., what portion of website
                          visitors make a purchase).
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>

                <div className="border-red-600 border rounded-xl p-4">
                  <div className="pb-4 text-red-600 text-3xl font-mono">
                    A/B Testing Tool
                  </div>
                  <div className="flex gap-8">
                    <Paper
                      onClick={() => {
                        navigate("/ab-testing/");
                      }}
                      className="w-80 shadow p-4 space-y-2 hover:shadow-2xl cursor-pointer group"
                    >
                      <div>
                        <img src={ABTestingLogo} className="rounded" />
                      </div>
                      <div className="">
                        <div className="text-xl font-medium group-hover:text-primary duration-200">
                          A/B testing Tool
                        </div>
                        <div className="text-zinc-500">
                          An experiment that compares two variations of
                          something by randomly splitting users into groups and
                          measuring which performs better.
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* Most Popular Articles  */}
      <div>
        <Container>
          <div className="space-y-8 py-16">
            {articlesData.length !== 0 && (
              <div className="space-y-4">
                <div className="text-4xl font-medium py-8">Most Popular</div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-3">
                  {articlesData.map((props) => {
                    return <MostPopularArticleCard key={props.id} {...props} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
      {/* All Articles  */}
      <div>
        <Container>
          <div className="space-y-8 py-16">
            <div className="flex gap-8 lg:flex-row lg:flex-nowrap flex-wrap-reverse">
              {articlesData.length !== 0 && (
                <div className="space-y-8 w-full p-4">
                  {articlesData.map((props) => {
                    return <ArticleStripe key={props.id} {...props} />;
                  })}
                </div>
              )}
              {articlesData.length !== 0 && (
                <div className="lg:w-80 flex-shrink-0 p-4 space-y-4 items-center justify-start flex flex-col w-full">
                  <div className="font-medium">
                    Discover our articles in various categories
                  </div>
                  <ArticlesCategoryCard extraStyle="lg:flex-wrap gap-4" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
