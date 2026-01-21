import type { Document, ObjectId } from 'mongodb';

export interface Product extends Document {
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
