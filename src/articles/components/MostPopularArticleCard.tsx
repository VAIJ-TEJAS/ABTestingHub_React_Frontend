import AuthorImage from "../../assets/images/author.jpeg";

export const MostPopularArticleCard = () => {
    return (
        <div>
            <div className="w-[360px] group space-y-4">
                <div className="space-y-1 group-hover:cursor-pointer">
                    <div className="text-2xl font-medium group-hover:text-primary transition-colors duration-200">
                        A Step-by-Step Guide to Preparing Data for Labeling
                    </div>
                    <div className="flex gap-2">
                        <img src={AuthorImage} className="h-10 w-10 object-cover rounded-full" />
                        <div>
                            <div className="font-semibold">Tejas Vaij</div>
                            <div className="text-sm text-zinc-500">Full Stack Developer</div>
                        </div>
                    </div>
                </div>
                <hr className="" />
            </div>
        </div>
    )
}
