export type Role = "CUSTOMER" | "ADMIN";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DRAFT";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  material?: string | null;
  purity?: string | null;
  stoneType?: string | null;
  stoneWeight?: number | null;
  metalWeight?: number | null;
  gender?: string | null;
  occasion?: string | null;
  weight?: number | null;
  dimensions?: string | null;
  categoryId: string;
  subcategoryId?: string | null;
  createdAt: Date;
  images: ProductImage[];
  category?: Category;
  subcategory?: Subcategory | null;
  reviews?: Review[];
  _count?: { reviews: number };
  averageRating?: number;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerified: boolean;
  productId: string;
  userId: string;
  createdAt: Date;
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: Date;
  items: OrderItem[];
  address: Address;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image: string;
  link?: string | null;
  buttonText?: string | null;
  position: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string | null;
  avatar?: string | null;
  rating: number;
  comment: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  purity?: string;
  stoneType?: string;
  gender?: string;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}
