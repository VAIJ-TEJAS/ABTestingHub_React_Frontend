import { Button } from "antd";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ArticlesCategoryCardProps {
  extraStyle?: string
}

const ArticlesCategoryCard: FC<ArticlesCategoryCardProps> = ({ extraStyle }) => {
  const navigate = useNavigate();

  const [articleCategories, setArticleCategories] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    axios.get(`https://89.116.33.88/categories/`).then((categories) => {
      setArticleCategories(categories.data);
    });
  });

  return articleCategories.length !== 0 && (
    <div className={`flex space-x-4 ${extraStyle}`}>
      {articleCategories.map(({ id, name }) => {
        return (
          <Button
            onClick={() => navigate(`/articles/${name}`)}
            key={id}
            size="small"
            className="border-black font-mono"
          >
            {name}
          </Button>
        );
      })}
    </div>
  )
};

export default ArticlesCategoryCard;
