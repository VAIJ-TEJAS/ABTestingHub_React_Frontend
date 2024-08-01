import { Container } from "@mui/material";
import YelloMaskImage from "../../assets/images/YellowMaskImage.png";
import YelloMask from "../../assets/images/YellowMask.png";
import { ArticleCard } from "../components/ArticleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/scoped-styles.css";
import { IArticle } from "../../types/article.types";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import Share from "../../assets/svgs/Share.svg";
import Calender from "../../assets/svgs/Calender.svg";
import dayjs from 'dayjs';

export const Article = () => {
  const { article_id } = useParams();

  const [article, setArticle] = useState<IArticle | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [content, setContent] = useState<string | TrustedHTML>("");

  const path = window.location.href;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/articles/${article_id}/`
        );
        setArticle(response.data);
        console.log(response.data);

        setContent(addSectionIdsToContent(response.data.content));
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [article_id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.5 }
    );

    // Observe sections for intersection
    document.querySelectorAll("h1[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [content]);

  const scrollToSection = (id: string) => {
    // console.log((id))
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const createMarkup = (htmlContent: string | TrustedHTML) => {
    return { __html: htmlContent };
  };

  const addSectionIdsToContent = (htmlContent: string) => {
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Select all h1 elements
    const headings = doc.querySelectorAll("h1");

    // Modify each h1 element to include an ID
    headings.forEach((heading, index) => {
      const sectionId = `section-${index}`;
      heading.id = sectionId; // Add the ID to the h1 element
    });

    // Serialize the document back to an HTML string
    const serializer = new XMLSerializer();
    const serializedHtml = serializer.serializeToString(doc);

    // console.log(serializedHtml)
    return serializedHtml;
  };

  const toc = article
    ? Array.from(
        new DOMParser()
          .parseFromString(article.content as string, "text/html")
          .querySelectorAll("h1")
      ).map((heading, index) => ({
        id: `section-${index}`, // Creating an ID for each heading
        text: heading.innerText,
      }))
    : [];

  return (
    <>
      <div className="">
        {/* <div className="sticky top-0 z-50 bg-white border-y border-zinc-500  py-2 flex justify-center">
          <ArticlesCategoryCard />
        </div> */}

        <Container className="-z-50">
          <div className="flex flex-col gap-16">
            <Container
              style={{
                backgroundImage: `url(${YelloMaskImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
              className="bg-black relative -z-40 rounded-2xl mt-16 p-4"
            >
              {/* Backdrop */}
              <img
                className="-z-10 h-full w-full"
                src={YelloMask}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
              {/* Text Content */}
              <div className="text-white text-4xl font-medium relative text-center p-8">
                {article?.title}
              </div>
              <div className="flex justify-between items-center text-white">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8">
                  <div className="flex gap-2">
                    <img
                      src={article?.author.picture ?? ""}
                      className="h-10 w-10 object-cover rounded-full"
                    />
                    <div>
                      <div className="font-semibold">
                        {article?.author?.name ?? "Author"}
                      </div>
                      <div className="text-sm ">
                        {article?.author.role ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <img src={Calender} className="w-8" />
                    <div>
                        {dayjs(article?.published_date).format('MMM D, YYYY')}
                    </div>
                  </div>
                </div>
                <div className="cursor-pointer rounded-full" onClick={() => {
                      navigator.share({
                        url: path,
                        title: "A/B Testing article",
                      });
                    }}>
                  <img src={Share} className="w-8" />
                </div>
              </div>
            </Container>

            <div
              className="border-2 border-secondary rounded-2xl p-8"
              style={{ boxShadow: "0px 1px 35px 10px #00000040" }}
            >
              <div className="w-full space-y-3">
                <div className="text-center text-2xl">TABLE OF CONTENTS</div>
                <Container className="text-lg space-y-3 ">
                  {toc.map((heading, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={`space-y-3 ${
                            activeSection === heading.id
                              ? "text-primary"
                              : "text-secondary"
                          }`}
                          key={heading.id}
                        >
                          <div
                            className="hover:text-primary hover:cursor-pointer"
                            onClick={() => scrollToSection(heading.id)}
                          >
                            {heading.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Container>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={createMarkup(content)}
              className="no-tailwind pb-8"
            />
          </div>
        </Container>

        {/* Related Articles */}
        <Container className="my-16">
          {(article?.previous_article || article?.next_article) && (
            <div className="flex justify-between gap-3">
              {article.previous_article ? (
                <Link
                  to={`/article/${article.previous_article?.id}`}
                  className="flex flex-1 flex-col items-start space-y-1 group cursor-pointer"
                >
                  <div className="text-xl flex justify-start items-start gap-1">
                    <div className="text-primary group-hover:animate-ping">
                      <LeftOutlined />
                    </div>
                    <div className="text-primary">PREVIOUS</div>
                  </div>
                  <div className="text-2xl font-medium group-hover:text-primary duration-200">
                    {article.previous_article.title}
                  </div>
                </Link>
              ) : (
                <p></p>
              )}

              <div className="text-zinc-500 flex-shrink-0">|</div>

              {article.next_article ? (
                <Link
                  to={`/article/${article.next_article?.id}`}
                  className="flex flex-1 flex-col items-end space-y-1 group cursor-pointer"
                >
                  <div className="text-xl flex items-start gap-1">
                    <div className="text-primary">NEXT</div>
                    <div className="text-primary group-hover:animate-ping">
                      <RightOutlined />
                    </div>
                  </div>
                  <div className="text-2xl font-medium group-hover:text-primary duration-200">
                    {article.next_article.title}
                  </div>
                </Link>
              ) : (
                <p></p>
              )}
            </div>
          )}

          {article?.related_articles?.length !== 0 && (
            <>
              <hr className="my-8" />
              <div className="text-4xl font-medium my-8">Related Articles</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-3">
                {article?.related_articles?.map((props) => {
                  return <ArticleCard key={props.id} {...props} />;
                })}
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};
