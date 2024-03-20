import CoverImage from "../../assets/images/cover.webp";
import AuthorImage from "../../assets/images/author.jpeg";

export const ArticleCard = () => {
    return (
        <>
            <div className="w-80 group">
                <div className="space-y-3 group-hover:cursor-pointer">
                    <div
                        style={{
                            backgroundImage: `url(${CoverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            overflow: 'hidden'
                        }} className="h-48 group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200">
                        IMG
                    </div>
                    <div className="text-2xl font-medium group-hover:text-primary transition-colors duration-200">
                        TITLE
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
        </>
    )
}
