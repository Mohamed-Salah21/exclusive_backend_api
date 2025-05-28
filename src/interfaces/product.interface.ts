import { CategoryI } from "./category.interface";

export interface ProductI {
  images: string[];
  subcategory: object;
  ratingsQuantity: number;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: 0;
  price: number;
  imageCover: string;
  category: CategoryI;
  subCategory: CategoryI;
  ratingsAverage: number;
}
