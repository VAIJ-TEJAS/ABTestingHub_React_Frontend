import { FC } from "react";

interface ArticleStripeProps {
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

export const ArticleStripe: FC<ArticleStripeProps> = ({
  author,
  title,
  short_description,
  category,
  cover_image,
}) => {
  return (
    <>
      <div className="group space-y-2 cursor-pointer">
        <div>
          <div className="py-1">
            <div className="flex space-x-2 items-center">
              <div className="flex items-center gap-2">
                <img
                  src={author?.picture || ""}
                  className="h-4 w-4 object-cover rounded-full"
                />
                <div className="font-medium text-xs text-zinc-800">
                  {author?.name || "author"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-xl font-medium group-hover:text-primary transition-colors duration-200">
                {title || "title"}
              </div>
              <div className="text text-zinc-500">
                {short_description || "text"}
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${cover_image?.image || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
              className="w-60 h-24 flex-shrink-0 rounded group-hover:rounded-xl group-hover:border group-hover:border-primary transition-all duration-200"
            >
              IMG
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-sm text-zinc-500">
          {/* <div className="font-mono">{date || ""}</div>
          <div>·</div> */}
          <div>{category?.name || "category"}</div>
        </div>
        <hr />
      </div>
    </>
  );
};
