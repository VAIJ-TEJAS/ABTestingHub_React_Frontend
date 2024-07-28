import dayjs from "dayjs";
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
  published_date,
  id,
}) => {
  return (
    <>
      <div className="w-80 group border-2 border-secondary rounded-xl p-4 bg-white" style={{boxShadow: "0px 5px 20px 0px #00000040"}}>
        <Link
          to={`/article/${id}`}
          className="group-hover:cursor-pointer"
        >
          <div className="space-y-3">
            <div
              style={{
                backgroundImage: `url(${cover_image?.image ?? ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
              className="h-48 rounded-xl group-hover:border group-hover:border-primary transition-all duration-200"
            >
              IMG
            </div>
            <div className="text-2xl font-medium group-hover:text-primary transition-colors duration-200">
              {title || "Title"}
            </div>
            <div>
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
                      {dayjs(published_date).format("MMMM DD, YYYY") ?? ""}
                    </div>
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
