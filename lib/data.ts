export const categories = [
  "Helmets",
  "Riding Gear",
  "Performance Parts",
  "Accessories",
  "Luggage",
  "Maintenance"
];

export const brands = [
  "KTM",
  "Kawasaki",
  "Ducati",
  "BMW",
  "Royal Enfield",
  "Triumph",
  "AGV",
  "Alpinestars",
  "Rynox",
  "MT",
  "Axor",
  "LS2",
  "SMK"
];

export const categoryCards = [
  {
    title: "Helmets",
    detail: "Full-face, modular and track-certified helmets from premium safety brands.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Riding Gear",
    detail: "Jackets, gloves, boots and riding pants built for all-weather protection and track speed.",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Performance Parts",
    detail: "Titanium exhausts, high-flow filters, brake systems and engine mapping components.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Accessories",
    detail: "Aerodynamic windscreens, ergonomic handle grips, crash protection, and phone mounts.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Luggage",
    detail: "Heavy-duty panniers, waterproof tail bags and tank luggage for transcontinental touring.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Maintenance",
    detail: "Premium chains, sintered brake pads, racing oils and filters to keep your engine sharp.",
    image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80"
  }
];

export const products = [
  {
    slug: "agv-k6-s-helmet",
    name: "AGV K6 S Full-Face Helmet - Mono Matte Black",
    category: "Helmets",
    brand: "AGV",
    price: 54999,
    rating: 4.9,
    availability: "In Stock",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    description: "The lightest road helmet in the world, developed with MotoGP technology. Combines maximum safety, premium comfort, and optimal aerodynamics for track and street riders alike.",
    compatibility: ["KTM RC 390", "Kawasaki Ninja ZX-10R", "Ducati Panigale V4", "BMW S 1000 RR", "Triumph Street Triple RS"],
    warranty: "5 Years Manufacturer Warranty",
    shipping: "Free Pan India Delivery in 2-3 Days"
  },
  {
    slug: "alpinestars-gp-pro-r3-gloves",
    name: "Alpinestars GP Pro R3 Racing Gloves",
    category: "Riding Gear",
    brand: "Alpinestars",
    price: 18499,
    rating: 4.8,
    availability: "In Stock",
    badge: "Track Ready",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=80",
    description: "Pure performance racing gloves with advanced protection, ergonomic design, and Kevlar lining. Offers ultimate tactile feedback and abrasion resistance.",
    compatibility: ["All Motorcycles (Universal Fit)"],
    warranty: "1 Year Manufacturer Warranty",
    shipping: "Free Delivery in 3-4 Days"
  },
  {
    slug: "akrapovic-slip-on-titanium-exhaust",
    name: "Akrapovic Slip-On Line Titanium Exhaust",
    category: "Performance Parts",
    brand: "Ducati",
    price: 134999,
    rating: 4.9,
    availability: "Limited",
    badge: "Premium Peak",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
    description: "Crafted from race-proven high-grade titanium. Delivers significant weight reduction, deep racing soundtrack, and direct power/torque improvements without remapping.",
    compatibility: ["Ducati Panigale V4 / V4S (2020-2026)", "Ducati Streetfighter V4", "Ducati Multistrada V4"],
    warranty: "2 Years Official Warranty",
    shipping: "Secured insured courier delivery in 5-7 Days"
  },
  {
    slug: "rynox-urban-x-jacket",
    name: "Rynox Stealth Evo V3 Riding Jacket",
    category: "Riding Gear",
    brand: "Rynox",
    price: 12999,
    rating: 4.7,
    availability: "In Stock",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=900&q=80",
    description: "India's highest-selling heavy duty touring jacket. Features level 2 Cerprotect armors, premium high-denacity mesh, and fully removable thermal and rain liners.",
    compatibility: ["Royal Enfield Himalayan 450 / Scrambler", "KTM Adventure 390", "BMW G 310 GS", "Triumph Tiger 900"],
    warranty: "1 Year Rynox Warranty",
    shipping: "Free Pan India Delivery in 2-3 Days"
  },
  {
    slug: "brembo-sintered-brake-pads",
    name: "Brembo Racing Z04 Sintered Brake Pads",
    category: "Performance Parts",
    brand: "Kawasaki",
    price: 8499,
    rating: 4.8,
    availability: "In Stock",
    badge: "Track Spec",
    image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=900&q=80",
    description: "True racing compound designed for maximum braking coefficient at high temperatures. Delivers highly consistent performance and eliminates lever fade completely.",
    compatibility: ["Kawasaki Ninja ZX-10R / ZX-6R", "BMW S 1000 RR", "Ducati Panigale V2", "Triumph Street Triple RS"],
    warranty: "Fits Brembo Monobloc Calipers",
    shipping: "Free Dispatch inside 24 Hours"
  },
  {
    slug: "bmw-motorrad-pro-tank-bag",
    name: "BMW Motorrad Pro Waterproof Tank Bag",
    category: "Luggage",
    brand: "BMW",
    price: 24999,
    rating: 4.9,
    availability: "In Stock",
    badge: "Touring",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
    description: "Fully waterproof tank bag with absolute seal zippers, magnetic quick-mount base system, and expandable volume. Perfect for long-distance adventure touring.",
    compatibility: ["BMW R 1250 GS / R 1300 GS", "BMW F 900 GS", "BMW G 310 GS"],
    warranty: "2 Years BMW Motorrad Warranty",
    shipping: "Free Pan India Delivery in 2-3 Days"
  }
];

export const testimonials = [
  {
    name: "Arjun Mehta",
    bike: "KTM 390 Duke",
    location: "Mumbai",
    rating: 5,
    review: "The AGV helmet arrived in 2 days, packaging was immaculate. Quality is on another level — feels exactly like what you'd buy at a European dealer. Octane is my go-to now.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Priya Nair",
    bike: "Royal Enfield Interceptor 650",
    location: "Bengaluru",
    rating: 5,
    review: "Finally a store that stocks genuine Rynox gear. The jacket fit perfectly and the customer support helped me pick the right size. Absolutely premium experience from start to finish.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Rahul Sharma",
    bike: "Kawasaki Ninja 650",
    location: "Delhi",
    rating: 5,
    review: "Ordered Akrapovic exhaust on Saturday, fitted by Tuesday. The fitment guide they included was spot on. Sound and power gains are real. Worth every rupee.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Vikram Patel",
    bike: "BMW G 310 R",
    location: "Pune",
    rating: 5,
    review: "Brembo brake pads made my stops dramatically sharper. The product description was accurate, shipping was fast, and the price was better than what I'd pay at the dealership.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Sneha Kulkarni",
    bike: "Triumph Street Triple",
    location: "Hyderabad",
    rating: 5,
    review: "The SW-Motech pannier system is built like a tank. Installation took 20 minutes, locks solid, and the quality is outstanding. Pan India delivery in 3 days — impressive!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  }
];

export const communityImages = [
  "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
];

export const posts = [
  {
    slug: "choosing-performance-exhaust",
    title: "How to Choose a Performance Exhaust Without Losing Rideability",
    category: "Performance",
    excerpt: "A practical guide to materials, maps, torque curves and noise limits.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"
  },
  {
    slug: "street-bike-setup",
    title: "The Modern Street Setup: Luggage, Lighting and Cockpit Tech",
    category: "Street",
    excerpt: "Build a superbike that stays calm, visible and useful when the miles stack up.",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1000&q=80"
  },
  {
    slug: "brake-pad-compounds",
    title: "Brake Pad Compounds Explained for Street and Track Riders",
    category: "Maintenance",
    excerpt: "What sintered, ceramic and organic pads actually change at the lever.",
    image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1000&q=80"
  }
];
