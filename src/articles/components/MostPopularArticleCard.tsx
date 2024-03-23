import { FC } from "react";
import { Link } from "react-router-dom";

interface MostPopularArticalCardProps {
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

export const MostPopularArticleCard: FC<MostPopularArticalCardProps> = ({
  title,
  author,
  id
}) => {
  return (
    <div>
      <div className="w-[360px] group space-y-4">
        <Link  to={`/article/${id}`} className="space-y-1 group-hover:cursor-pointer">
          <div className="text-2xl font-medium group-hover:text-primary transition-colors duration-200">
            {title || "Article Title"}
          </div>
          <div className="flex gap-2">
            <img
              src={author?.picture ?? ""}
              className="h-10 w-10 object-cover rounded-full"
            />
            <div>
              <div className="font-semibold">{author?.name ?? "Author"}</div>
              <div className="text-sm text-zinc-500">
                {author?.role ?? "Role"}
              </div>
            </div>
          </div>
        </Link>
        <hr className="" />
      </div>
    </div>
  );
};
