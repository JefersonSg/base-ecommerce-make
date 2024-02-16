export interface CommentInterface {
  _id: string;
  userId: string;
  comment: string;
  date: string;
  hours: number;
  images: string[];
  stars: number;
  edited: boolean;
}

export interface ProductDataFrontEnd {
  name: string;
  brand: string;
  price: number;
  size: string;
  category: string;
  subcategory: string;
  description: string;
  composition: string;
  characteristic: string;
  images: Object[];
  colors: string;
  codeColors: string;
  amount: string;
  promotion: boolean;
  active: boolean;
  promotionalPrice: number;
  comments: CommentInterface[];
}

export interface ProductDataBackEnd {
  name: string;
  brand: string;
  price: number;
  size: string;
  category: string;
  subcategory: string;
  description: string;
  composition: string;
  characteristic: string;
  images: string[];
  colors: string[];
  codeColors: string[];
  stock: {
    amount: number[];
  };
  promotion: boolean;
  active: boolean;
  promotionalPrice: number;
  comments: CommentInterface[];
}
