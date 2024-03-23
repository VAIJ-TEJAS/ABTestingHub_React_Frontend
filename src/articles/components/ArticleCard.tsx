import { FC } from "react";
import { Link } from "react-router-dom";

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

export const ArticleCard: FC<ArticalCardProps> = ({
  cover_image,
  title,
  author,
  short_description,
  id,
}) => {
  return (
    <>
      <div className="w-80 group">
        <Link
          to={`/article/${id}`}
          className="space-y-3 group-hover:cursor-pointer"
        >
          <div
            style={{
              backgroundImage: `url(${cover_image?.image ?? ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
            }}
            className="h-48 group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200"
          >
            IMG
          </div>
          <div className="text-2xl font-medium group-hover:text-primary transition-colors duration-200">
            {title || "Title"}
          </div>
          <div className="text-zinc-500">
            {short_description ?? "Short description"}
          </div>
          <div className="py-3">
            <div className="flex space-x-2 items-center">
              <div className="flex gap-2">
                <img
                  src={author?.picture ?? ""}
                  className="h-10 w-10 object-cover rounded-full"
                />
                <div>
                  <div className="font-semibold">
                    {author?.name ?? "author"}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {author?.role ?? "role"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
