import { Container, Paper } from "@mui/material";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaRedditAlien, FaRegCopy } from 'react-icons/fa';
import CoverImage from "../../assets/images/cover.webp";
import AuthorImage from "../../assets/images/author.jpeg";
import { ArticleCard } from "../components/ArticleCard";
import { useEffect, useState } from "react";
import axios from "axios"
import '../../css/scoped-styles.css';
import { IArticle } from "../../types/article.types";

export const Article = () => {

  const [article, setArticle] = useState<IArticle | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [content, setContent] = useState<string | TrustedHTML>("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Replace this URL with the actual endpoint you're using to fetch the article
        const response = await axios.get('https://89.116.33.88/articles/');
        setArticle(response.data[0]);
        setContent(addSectionIdsToContent(response.data[0].content));
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '0px', threshold: 0.5 });

    // Observe sections for intersection
    document.querySelectorAll('h1[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [content]);

  const scrollToSection = (id : string) => {
    console.log((id))
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const createMarkup = (htmlContent: string | TrustedHTML) => {
    return { __html: htmlContent };
  };

  const addSectionIdsToContent = (htmlContent: string) => {
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
  
    // Select all h1 elements
    const headings = doc.querySelectorAll('h1');
  
    // Modify each h1 element to include an ID
    headings.forEach((heading, index) => {
      const sectionId = `section-${index}`;
      heading.id = sectionId; // Add the ID to the h1 element
    });
  
    // Serialize the document back to an HTML string
    const serializer = new XMLSerializer();
    const serializedHtml = serializer.serializeToString(doc);
  
    console.log(serializedHtml)
    return serializedHtml;
  };

  const toc = article
    ? Array.from(new DOMParser().parseFromString(article.content as string, 'text/html').querySelectorAll('h1')).map((heading, index) => ({
      id: `section-${index}`, // Creating an ID for each heading
      text: heading.innerText,
    }))
    : [];

  return (
    <>
      <>
        {/* Top container with the image */}
        <Container
          style={{
            backgroundImage: `url(${CoverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
          className="bg-black relative z-10 rounded-b-md"
        >
          {/* Backdrop */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
          </div>
          {/* Text Content */}
          <div className="text-white text-4xl font-medium h-[300px] w-[1200px] flex items-center z-10 relative">
            Flowbite Blocks Tutorial - Learn how to get started with custom sections using the Flowbite Blocks
          </div>
        </Container>

        {/* Bottom container that overlaps the top one */}
        <Container className="-mt-16 relative z-20">
          <Paper className="p-5 pb-8 flex">
            <div className="flex-1 space-y-8">
              <div className="w-full flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  <div className="flex gap-2">
                    <img src={AuthorImage} className="h-10 w-10 object-cover rounded-full" />
                    <div>
                      <div className="font-semibold">Tejas Vaij</div>
                      <div className="text-sm text-zinc-500">Full Stack Developer</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" aria-label="Share on Facebook" className="text-blue-600 w-10 h-10 flex items-center justify-center rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all"><FaFacebookF size={24} /></a>
                  <a href="#" aria-label="Share on Twitter" className="text-blue-400 w-10 h-10 flex items-center justify-center rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all"><FaTwitter size={24} /></a>
                  <a href="#" aria-label="Share on LinkedIn" className="text-blue-700 w-10 h-10 flex items-center justify-center rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all"><FaLinkedinIn size={24} /></a>
                  <a href="#" aria-label="Share on Reddit" className="text-orange-600 w-10 h-10 flex items-center justify-center rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all"><FaRedditAlien size={24} /></a>
                  <button className="text-gray-600 w-10 h-10 flex items-center justify-center rounded hover:bg-blue-100 hover:border hover:border-blue-300"><FaRegCopy size={24} /></button>
                </div>
              </div>
              <div dangerouslySetInnerHTML={createMarkup(content)} className="no-tailwind" />
            </div>
            <div className="w-64 space-y-3 pl-3 relative">
              <div className="sticky top-4">
                <h1 className="font-mono text-xs text-zinc-500">
                  TABLE OF CONTENTS
                </h1>
                <div className="text-lg space-y-3 py-3">
                  {toc.map((heading, index) => {
                    return (
                      <div key={index}>
                        <div className={`space-y-3 ${activeSection === heading.id ? 'text-primary' : ''}`}  key={heading.id} >
                          <div className="font-bold hover:text-primary hover:cursor-pointer" onClick={() => scrollToSection(heading.id)}>
                            {heading.text}
                          </div>
                          <div className="border-b" />
                        </div>
                      </div>
                    )
                  })
                  }
                </div>
              </div>
            </div>
          </Paper>
        </Container>

        {/* Related Articles */}
        <Container className="my-16">
          <hr className="my-8" />
          <div className="text-4xl font-medium my-8">
            Related Articles
          </div>
          <div className="flex justify-between">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
        </Container>
      </>
    </>
  );
}

