import { type ObjectId } from "mongoose";

export interface CommentInterface {
  productId: ObjectId;
  userId: ObjectId;
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
  subcategory?: string;
  description: string;
  composition?: string;
  characteristic?: string;
  howToUse?: string;
  images: object[];
  colors?: string;
  codeColors?: string;
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
  size: string[];
  category: string;
  subcategory: string;
  description: string;
  composition: string;
  characteristic: string;
  hotToUse?: string;
  images: string[];
  colors: string[];
  codeColors: string[];
  stock: {
    amount: number[][];
  };
  promotion: boolean;
  active: boolean;
  promotionalPrice: number;
  sales: number;
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
  email: string;
  nome: string;
  cpf: string;
  uf: string;
  telefone: string;
}

export interface OrderInterface {
  _id: string;
  userId: ObjectId;
  paymentId: string;
  paymentLink: string;
  address: [AddressInterface];
  status: string;
  productIds: ObjectId[];
  valueProducts: number[];
  productAmounts: number[];
  productSizes: string[];
  productColors: string[];
  totalPayment: number;
  methodPayment: string;
  discount: number;
  orderTracking: string;
  createdAt: string;
}

export interface ItemsCartInterface {
  _id: string;
  shoppingCartId: string;
  productId: string;
  size: string;
  amount: number;
  color?: string | undefined;
}

export interface delivery {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  custom_delivery_time: number;
  custom_delivery_range: {
    min: number;
    max: number;
  };
  packages: [
    {
      price: string;
      discount: string;
      format: string;
      weight: string;
      insurance_value: string;
      products: [
        {
          id: string;
          quantity: number;
        },
      ];
      dimensions: {
        height: number;
        width: number;
        length: number;
      };
    },
  ];
  company: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
}

export interface cuponsInterface {
  _id?: string;
  code: string;
  userId?: string[];
  expiration?: Date;
  limitUses: number;
  uses: number;
  percentageDiscount: number;
  minimumValue: number;
}
