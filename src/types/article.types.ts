import { IAuthor } from "./author.types";
import { ICategory } from "./category.types";
import { ICoverImage } from "./cover_image.types";

enum ArticleStatus {
    DRAFT = "DR",
    PUBLISHED = "PB",
    ARCHIVED = "AR",
}

export interface IArticle {
    id: number;
    author: IAuthor;
    cover_image: ICoverImage;
    category: ICategory;
    title: string;
    short_description: string;
    content: string | TrustedHTML; 
    published_date: string; 
    related_articles?: IArticle[]; 
    popular_article: boolean;
    featured_article: boolean;
    previous_article?: IArticle; 
    next_article?: IArticle; 
    status: ArticleStatus;
}