export interface CommentInterface {
  productId: string;
  userId: string;
  comment: string;
  image?: string[];
  stars: number;
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

export interface BannerInterface {
  name: string;
  link: string;
  active: boolean;
  images: string[]
}
export interface itemCart {
  _id: string;
  shoppingCartId: string;
  productId: string;
  color: string;
  amount: string;
  size: string;
}

export interface shoopingCart {
  _id: string;
  userId: string;
}

export interface AdressInterface {
  userId: string;
  cidade: string;
  rua: string;
  bairro: string;
  cep: string;
  complemento: string;
  referencia: string;
  numero: string;
}