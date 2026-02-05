export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Brass Dhoop Vessel",
    price: 4800,
    category: "Sacred Crafts",
    image: "/product-1",
    description: "Hand-forged brass incense vessel with ceremonial ring handles. Each piece carries the quiet authority of temple tradition.",
    rating: 4.8,
    reviews: 24,
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Banarasi Silk Stole",
    price: 12500,
    category: "Textiles",
    image: "/product-2",
    description: "Pure silk stole with handwoven zari border from the looms of Varanasi. A heritage piece that speaks without words.",
    rating: 4.9,
    reviews: 31,
    badge: "New Arrival",
  },
  {
    id: "3",
    name: "Sandalwood Keepsake Box",
    price: 6200,
    category: "Sacred Crafts",
    image: "/product-3",
    description: "Hand-carved sandalwood box with floral mandala motif. The fragrance deepens with time, like memory itself.",
    rating: 4.7,
    reviews: 18,
  },
  {
    id: "4",
    name: "Hammered Copper Handi",
    price: 3400,
    category: "Home & Living",
    image: "/product-4",
    description: "Traditional hammered copper vessel, shaped by artisan hands over slow hours. Meant for rituals both sacred and daily.",
    rating: 4.6,
    reviews: 42,
  },
  {
    id: "5",
    name: "Temple Brass Bell",
    price: 5600,
    category: "Sacred Crafts",
    image: "/product-5",
    description: "Cast brass bell with ornamental base ring. Its tone resonates with centuries of devotional craft.",
    rating: 4.9,
    reviews: 15,
    badge: "Limited Edition",
  },
  {
    id: "6",
    name: "Bidri Art Vase",
    price: 8900,
    category: "Home & Living",
    image: "/product-6",
    description: "Bidriware vase with inlaid gold floral patterns on dark alloy. A living museum piece for the discerning collector.",
    rating: 4.8,
    reviews: 9,
    badge: "Exclusive",
  },
];

export const categories = [
  { name: "Sacred Crafts", slug: "sacred-crafts", image: "/category-sacred" },
  { name: "Textiles", slug: "textiles", image: "/category-textiles" },
  { name: "Jewelry", slug: "jewelry", image: "/category-jewelry" },
];
