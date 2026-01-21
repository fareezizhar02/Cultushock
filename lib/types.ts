import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  productId: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  collection: string;
  category: string;
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt?: Date;
}