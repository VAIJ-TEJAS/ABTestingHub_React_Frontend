import CoverImage from "../../assets/images/cover.webp";
import AuthorImage from "../../assets/images/author.jpeg";

export const ArticleStripe = () => {
    return (
        <>
            <div className="group space-y-2 cursor-pointer">
                <div>
                    <div className="py-1">
                        <div className="flex space-x-2 items-center">
                            <div className="flex items-center gap-2">
                                <img src={AuthorImage} className="h-4 w-4 object-cover rounded-full" />
                                <div className="font-medium text-xs text-zinc-800">Tejas Vaij</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <div className="text-xl font-medium group-hover:text-primary transition-colors duration-200">
                                TITLE
                            </div>
                            <div className="text text-zinc-500">
                                The latest release of Adala, an agent framework to automate data processing tasks, including data labeling and data generation
                            </div>
                        </div>
                        <div
                            style={{
                                backgroundImage: `url(${CoverImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                overflow: 'hidden'
                            }} className="w-60 h-24 flex-shrink-0 rounded group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200">
                            IMG
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 text-sm text-zinc-500">
                    <div className="font-mono">
                        Mar 17, 2024
                    </div>
                    <div>
                        ·
                    </div>
                    <div>Data Science</div>
                </div>
                <hr/>
            </div>
        </>
    )
}
