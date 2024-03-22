import { Container } from "@mui/material"
import { ArticleCard } from "../components/ArticleCard"
import { Button } from "antd"
import CoverImage from "../../assets/images/cover.webp";
import AuthorImage from "../../assets/images/author.jpeg";
import { MostPopularArticleCard } from "../components/MostPopularArticleCard";


export const ArticlesHome = () => {
    return (
        <>
            <Container>
                <div className="flex justify-between items-center my-8">
                    <div className="text-6xl font-medium">
                        Articles
                    </div>
                    <div className="flex space-x-4">
                        <Button size="small" className="border-black font-mono">NEWSLETTER</Button>
                        <Button size="small" className="border-black font-mono">EXAMPLE</Button>
                        <Button size="small" className="border-black font-mono">GUIDE</Button>
                        <Button size="small" className="border-black font-mono">INTEGRATIONS</Button>
                        <Button size="small" className="border-black font-mono">RELEASE NOTES</Button>
                        <Button size="small" className="border-black font-mono">PRODUCT</Button>
                        <Button size="small" className="border-black font-mono">COMMUNITY</Button>
                        <Button size="small" className="border-black font-mono">TUTORIALS</Button>
                    </div>
                </div>
                <div className="flex gap-16">
                    <div className="flex-1 group">
                        <div className="space-y-3 group-hover:cursor-pointer">
                            <div
                                style={{
                                    backgroundImage: `url(${CoverImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    overflow: 'hidden'
                                }} className="h-96 group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200">
                                IMG
                            </div>
                            <div className="text-5xl font-medium group-hover:text-primary transition-colors duration-200">
                                Interactive Data Labeling with  LLMs ans Label Studio's Prompt Interface
                            </div>
                            <div className="text-zinc-500">
                                The latest release of Adala, an agent framework to automate data processing tasks, including data labeling and data generation, features more ways to capture feedback and parallel skills execution contributed by a community member.
                            </div>
                            <div className="py-3">
                                <div className="flex space-x-2 items-center">
                                    <div className="flex gap-2">
                                        <img src={AuthorImage} className="h-10 w-10 object-cover rounded-full" />
                                        <div>
                                            <div className="font-semibold">Tejas Vaij</div>
                                            <div className="text-sm text-zinc-500">Full Stack Developer</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-4xl font-medium">
                            Most Popular
                        </div>
                        <div className="space-y-3">
                            <MostPopularArticleCard/>
                            <MostPopularArticleCard/>
                            <MostPopularArticleCard/>
                        </div>
                    </div>
                </div>
                <hr className="my-8" />
                <div className="grid grid-cols-3 justify-items-center gap-8">
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                    <ArticleCard />
                </div>
                <hr className="my-8" />
            </Container>
        </>
    )
}
