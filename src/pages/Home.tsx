/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@mui/material";
import { Button } from "antd";
import HeroImage from "../assets/images/hero-image.png";
import HeroBackground from "../assets/images/hero-background.png";
import ContinuousMetricLogo from "../assets/images/ContinuousMetric.png";
import ProportionalMetricLogo from "../assets/images/ProportionalMetric.png";
import ABTestingLogo from "../assets/images/ABTesting.png";
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
      <div style={{background: `url(${HeroBackground})`, backgroundSize:'cover'}} className="m-4 rounded-xl">
      <div className="inset-0 bg-black bg-opacity-50 rounded-xl">
        <Container >
          <div className="flex flex-col justify-between lg:flex-row py-32">
            <div className="space-y-8 text-white flex flex-col items-center lg:items-start">
              <div className="text-3xl font-bold lg:text-left text-center lg:text-6xl sm:text-4xl">Unlock the Power of Experimentation</div>
              <div className="text-xl mx-auto w-3/4 text-center lg:mx-0 lg:text-left sm:w-1/2 sm:text-2xl">
                Transform Your Digital Strategy with AB Testing Hub
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
                    DASHBOARD
                  </Button>
                ) : (
                  <Button
                    size="large"
                    type="primary"
                    className="px-6 transition duration-200"
                    onClick={showAuthModal}
                  >
                    GET STARTED
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden lg:block flex-shrink-0">
              <img
                style={{objectFit:"cover"}}
                src={HeroImage}
                className="h-80 w-[520px] rounded-xl"
                />
            </div>
          </div>
        </Container>
        </div>
      </div>
      {/* Tools  */}
      <div id="tools-we-offer">
        <Container>
          <div className="gap-8 py-16">
            <div className="space-y-4">
              <div className="text-4xl font-medium py-8">TOOLS WE OFFER</div>
              <div className="flex justify-between gap-8">
                <div className="rounded-xl">
                    <div
                      style={{boxShadow: "0px 15px 20px 0px #00000040 "}}
                      onClick={() => {
                        navigate("/continuous-metric-testing/");
                      }}
                      className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2" 
                    >
                      <div className="p-2">
                        <img src={ContinuousMetricLogo} className="rounded-xl w-full h-60" style={{objectFit:'cover'}}/>
                      </div>
                      <div className="p-4">
                        <div className="text-2xl text-secondary">
                          Continuous Metric Testing
                        </div>
                        <div className="text-[#2E383F] pt-4">
                          Measures how much of something there is, taking any
                          value on a scale (e.g., how long users watch a video
                          on average).
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Button className="flex items-center justify-center w-full text-lg text-primary border-2 border-primary p-6">
                          EXPLORE
                        </Button>
                      </div>
                    </div>
                </div>

                <div className="rounded-xl">        
                    <div
                      style={{boxShadow: "0px 15px 20px 0px #00000040 "}}
                      onClick={() => {
                        navigate("/proportional-metric-testing/");
                      }}
                      className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2" 
                    >
                      <div className="p-2">
                        <img src={ProportionalMetricLogo} className="rounded-xl bg-cover w-full h-60" style={{objectFit:'cover'}}/>
                      </div>
                      <div className="p-4">
                        <div className="text-2xl text-secondary">
                          Proportional metric Testing
                        </div>
                        <div className="text-[#2E383F] pt-4">
                          Represents a fraction of a whole, expressed as a
                          percentage or ratio (e.g., what portion of website
                          visitors make a purchase).
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Button className="flex items-center justify-center w-full text-lg text-primary border-2 border-primary p-6">
                          EXPLORE
                        </Button>
                      </div>
                    </div>
                </div>

                <div className="rounded-xl">
                    <div
                      style={{boxShadow: "0px 15px 20px 0px #00000040 "}}
                      onClick={() => {
                        navigate("/ab-testing/");
                      }}
                      className="bg-white w-80 space-y-2 cursor-pointer rounded-xl border-secondary border-2"
                    >
                      <div className="p-2">
                        <img src={ABTestingLogo} className="rounded-xl bg-cover w-full h-60" style={{objectFit:'cover'}}/>
                      </div>
                      <div className="p-4">
                        <div className="text-2xl text-secondary">
                          A/B testing Tool
                        </div>
                        <div className="text-[#2E383F] pt-4">
                          An experiment that compares two variations of
                          something by randomly splitting users into groups and
                          measuring which performs better.
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Button className="flex items-center justify-center w-full text-lg text-primary border-2 border-primary p-6">
                          EXPLORE
                        </Button>
                      </div>
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
