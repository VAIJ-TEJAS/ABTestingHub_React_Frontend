import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ArticlesCategoryCard = () => {
  const navigate = useNavigate();

  const [articleCategories, setArticleCategories] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    axios.get(`https://89.116.33.88/categories/`).then((categories) => {
      setArticleCategories(categories.data);
    });
  });

  return (
    <div className="flex space-x-4">
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
  );
};

export default ArticlesCategoryCard;
