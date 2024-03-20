import { Container, Paper } from "@mui/material";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaRedditAlien, FaRegCopy } from 'react-icons/fa';
import CoverImage from "./assets/images/cover.webp";
import AuthorImage from "./assets/images/author.jpeg";
import { ArticleCard } from "../components/ArticleCard";

export const Article = () => {

    const richTextContent = `
  <article>
  <header>
    <h1>The Future of Data Science</h1>
    <p class="author">By Jane Doe | <time datetime="2024-03-21">March 21, 2024</time></p>
  </header>
  <section>
    <p>Data science is rapidly evolving as a field, pushing the boundaries of what we can achieve with big data and analytics. With advancements in machine learning and artificial intelligence, data scientists are now at the forefront of innovation in nearly every industry.</p>
  </section>
  <section>
    <h2>The Impact of Machine Learning</h2>
    <p>Machine learning algorithms have transformed data science, providing new ways to analyze complex datasets. By leveraging neural networks and deep learning, data scientists can uncover patterns and insights that were previously unattainable.</p>
  </section>
  <section>
    <h2>Challenges in Data Privacy</h2>
    <p>As data science grows, so do concerns around data privacy. Ensuring the ethical use of data and protecting individual privacy must be a priority as we develop more powerful data-driven technologies.</p>
  </section>
  <section>
    <h2>Big Data in Healthcare</h2>
    <p>The healthcare industry benefits greatly from data science. Predictive analytics and medical data analysis are saving lives by providing more personalized care and better diagnostic tools.</p>
  </section>
  <section>
    <h2>Looking Ahead</h2>
    <p>The future of data science is one of continued growth and integration into daily life. As we find more applications for AI and analytics, data science will become an even more integral part of technological progress.</p>
  </section>
  <footer>
    <p>© 2024 Jane Doe. All rights reserved.</p>
  </footer>
  <header>
    <h1>The Future of Data Science</h1>
    <p class="author">By Jane Doe | <time datetime="2024-03-21">March 21, 2024</time></p>
  </header>
  <section>
    <p>Data science is rapidly evolving as a field, pushing the boundaries of what we can achieve with big data and analytics. With advancements in machine learning and artificial intelligence, data scientists are now at the forefront of innovation in nearly every industry.</p>
  </section>
  <section>
    <h2>The Impact of Machine Learning</h2>
    <p>Machine learning algorithms have transformed data science, providing new ways to analyze complex datasets. By leveraging neural networks and deep learning, data scientists can uncover patterns and insights that were previously unattainable.</p>
  </section>
  <section>
    <h2>Challenges in Data Privacy</h2>
    <p>As data science grows, so do concerns around data privacy. Ensuring the ethical use of data and protecting individual privacy must be a priority as we develop more powerful data-driven technologies.</p>
  </section>
  <section>
    <h2>Big Data in Healthcare</h2>
    <p>The healthcare industry benefits greatly from data science. Predictive analytics and medical data analysis are saving lives by providing more personalized care and better diagnostic tools.</p>
  </section>
  <section>
    <h2>Looking Ahead</h2>
    <p>The future of data science is one of continued growth and integration into daily life. As we find more applications for AI and analytics, data science will become an even more integral part of technological progress.</p>
  </section>
  <footer>
    <p>© 2024 Jane Doe. All rights reserved.</p>
  </footer>
  <header>
    <h1>The Future of Data Science</h1>
    <p class="author">By Jane Doe | <time datetime="2024-03-21">March 21, 2024</time></p>
  </header>
  <section>
    <p>Data science is rapidly evolving as a field, pushing the boundaries of what we can achieve with big data and analytics. With advancements in machine learning and artificial intelligence, data scientists are now at the forefront of innovation in nearly every industry.</p>
  </section>
  <section>
    <h2>The Impact of Machine Learning</h2>
    <p>Machine learning algorithms have transformed data science, providing new ways to analyze complex datasets. By leveraging neural networks and deep learning, data scientists can uncover patterns and insights that were previously unattainable.</p>
  </section>
  <section>
    <h2>Challenges in Data Privacy</h2>
    <p>As data science grows, so do concerns around data privacy. Ensuring the ethical use of data and protecting individual privacy must be a priority as we develop more powerful data-driven technologies.</p>
  </section>
  <section>
    <h2>Big Data in Healthcare</h2>
    <p>The healthcare industry benefits greatly from data science. Predictive analytics and medical data analysis are saving lives by providing more personalized care and better diagnostic tools.</p>
  </section>
  <section>
    <h2>Looking Ahead</h2>
    <p>The future of data science is one of continued growth and integration into daily life. As we find more applications for AI and analytics, data science will become an even more integral part of technological progress.</p>
  </section>
  <footer>
    <p>© 2024 Jane Doe. All rights reserved.</p>
  </footer>
</article>
  `;

    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

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
                            <div dangerouslySetInnerHTML={createMarkup(richTextContent)} />
                        </div>
                        <div className="w-64 space-y-3 pl-3 relative">
                            <div className="sticky top-4">
                                <div className="font-mono text-xs text-zinc-500">
                                    TABLE OF CONTENTS
                                </div>
                                <div className="text-lg space-y-3">
                                    <div className="space-y-3">
                                        <div className="font-bold 
                hover:text-primary hover:cursor-pointer">
                                            Introduction
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
                hover:text-primary hover:cursor-pointer
              ">
                                            The Challenges of Multiple Repositories
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
               hover:text-primary hover:cursor-pointer
              ">
                                            Addressing the Challenges
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
                hover:text-primary hover:cursor-pointer
              ">
                                            Label Studio's New Monorepo Architecture
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
                hover:text-primary hover:cursor-pointer
              ">
                                            Benefits for Label Studio Community
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
                hover:text-primary hover:cursor-pointer
              ">
                                            TL;DR
                                        </div>
                                        <div className="border-b" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="font-bold
                hover:text-primary hover:cursor-pointer
              ">
                                            Conclusion
                                        </div>
                                        <div className="border-b" />
                                    </div>
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

