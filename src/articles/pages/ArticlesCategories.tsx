import { Container } from "@mui/material"
import { ArticleCard } from "../components/ArticleCard"
import { Button } from "antd"

export const Categories = () => {
    return (
        <>
            <Container>
                <div className="flex justify-between items-center my-8">
                    <div className="text-6xl font-medium">
                        Newsletters
                    </div>
                </div>
                <div className="flex space-x-4">
                    <Button type="primary" size="small" className="border-black font-mono">NEWSLETTER</Button>
                    <Button size="small" className="border-black font-mono">EXAMPLE</Button>
                    <Button size="small" className="border-black font-mono">GUIDE</Button>
                    <Button size="small" className="border-black font-mono">INTEGRATIONS</Button>
                    <Button size="small" className="border-black font-mono">RELEASE NOTES</Button>
                    <Button size="small" className="border-black font-mono">PRODUCT</Button>
                    <Button size="small" className="border-black font-mono">COMMUNITY</Button>
                    <Button size="small" className="border-black font-mono">TUTORIALS</Button>
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
