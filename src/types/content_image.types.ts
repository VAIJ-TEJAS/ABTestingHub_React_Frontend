import { IArticle } from "./article.types";

export interface IContentImage {
    id: number;
    name: string;
    article: IArticle;
    image: string;
}