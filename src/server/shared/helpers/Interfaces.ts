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

export interface CategoryInterface {
  name: string;
  description: string;
  image: string;
}
export interface SubcategoryInterface {
  name: string;
  description: string;
  category: string;
  image: string;
}
export interface BannerInterface {
  name: string;
  link: string;
  active: boolean;
  imageMobile: string;
  imageDesktop: string;
}
export interface itemCart {
  _id: string;
  shoppingCartId: string;
  productId: string;
  color: string;
  amount: string;
  size: string;
}

export interface shoppingCart {
  _id: string;
  userId: string;
}

export interface AddressInterface {
  userId: string;
  cidade: string;
  rua: string;
  bairro: string;
  cep: string;
  complemento: string;
  referencia: string;
  numero: string;
}
