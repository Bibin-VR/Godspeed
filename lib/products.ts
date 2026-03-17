export type ProductCategory = "Supplements" | "Equipment" | "Accessories"

export type Product = {
  id: string
  name: string
  category: ProductCategory
  priceInr: number
  description: string
  highlights: string[]
  imageUrl: string
  inStock: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: "whey-pro-isolate",
    name: "GodSpeed Whey Pro Isolate",
    category: "Supplements",
    priceInr: 2899,
    description: "Fast-absorbing whey isolate for lean muscle recovery after training.",
    highlights: ["27g protein/serving", "Low carb", "Chocolate flavor"],
    imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
  },
  {
    id: "creatine-monohydrate",
    name: "Micronized Creatine",
    category: "Supplements",
    priceInr: 1199,
    description: "Daily performance and strength support for progressive overload phases.",
    highlights: ["3g scoop", "Unflavored", "Lab tested"],
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
  },
  {
    id: "preworkout-voltage",
    name: "Voltage Pre-Workout",
    category: "Supplements",
    priceInr: 1499,
    description: "High-focus formula for intense sessions and cleaner energy.",
    highlights: ["Citrulline blend", "Caffeine + nootropics", "Blue raspberry"],
    imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c4d44362f?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
  },
  {
    id: "lifting-straps",
    name: "Heavy Duty Lifting Straps",
    category: "Accessories",
    priceInr: 799,
    description: "Cotton-nylon straps for deadlifts, rows, and pull-day volume.",
    highlights: ["Padded wrist", "Non-slip weave", "Pair included"],
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
  },
  {
    id: "resistance-bands",
    name: "Progressive Resistance Band Set",
    category: "Equipment",
    priceInr: 999,
    description: "Portable resistance kit for warmups, mobility, and travel workouts.",
    highlights: ["5 resistance levels", "Door anchor", "Carry pouch"],
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    inStock: false,
  },
  {
    id: "omega-multivitamin",
    name: "Daily Omega + Multi Stack",
    category: "Supplements",
    priceInr: 1399,
    description: "Core daily micronutrient support for active recovery and wellness.",
    highlights: ["60 servings", "Omega-3 + multi", "Easy capsules"],
    imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1200&q=80",
    inStock: true,
  },
]
