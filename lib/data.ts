export const categories = [
  "Exhausts systems",
  "Air filters",
  "Protection parts",
  "Tank pads",
  "Traction pads",
  "Brake pads",
  "Fork seals",
  "Windscreen",
  "Chain sprockets",
  "Handle grips",
  "Dash protectors",
  "Aux lights",
  "Luggage",
  "Electronics",
  "Tyres",
  "Phone mount",
  "GPS",
  "Hand guards",
  "Led bulbs",
  "Indicators"
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
  "Rynox"
];

export const categoryCards = [
  {
    title: "Exhausts systems",
    detail: "Premium titanium and carbon fiber slip-ons and full systems for maximum power.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Protection parts",
    detail: "Engine guards, frame sliders and crash protection to keep your bike safe.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Tyres",
    detail: "Track-spec and street-legal rubber for ultimate grip and cornering stability.",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Luggage",
    detail: "Heavy-duty panniers, waterproof tail bags and tank luggage for touring.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Brake pads",
    detail: "Sintered and ceramic racing compounds for dramatically sharper stopping power.",
    image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Windscreen",
    detail: "Aerodynamic double bubble screens to improve wind protection and speed.",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=900&q=80"
  }
];

export const products = [
  {
    slug: "akrapovic-slip-on-titanium-exhaust",
    name: "Akrapovic Slip-On Line Titanium Exhaust",
    category: "Exhausts systems",
    brand: "Ducati",
    price: 13499,
    rating: 4.9,
    availability: "Limited",
    badge: "Premium Peak",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
    description: "Crafted from race-proven high-grade titanium. Delivers significant weight reduction, deep racing soundtrack, and direct power/torque improvements without remapping.",
    compatibility: ["Ducati Panigale V4 / V4S (2020-2026)", "Ducati Streetfighter V4", "Ducati Multistrada V4"],
    warranty: "2 Years Official Warranty",
    shipping: "Secured insured courier delivery in 5-7 Days",
    specs: ["Titanium Build", "-2.5kg Weight", "No Remap Required"],
    options: ["Carbon Cap", "Titanium Cap"],
    stockCount: 3,
    relatedThumbs: ["https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=150&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80"]
  },
  {
    slug: "brembo-sintered-brake-pads",
    name: "Brembo Racing Z04 Sintered Brake Pads",
    category: "Brake pads",
    brand: "Kawasaki",
    price: 849,
    rating: 4.8,
    availability: "In Stock",
    badge: "Track Spec",
    image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=900&q=80",
    description: "True racing compound designed for maximum braking coefficient at high temperatures. Delivers highly consistent performance and eliminates lever fade completely.",
    compatibility: ["Kawasaki Ninja ZX-10R / ZX-6R", "BMW S 1000 RR", "Ducati Panigale V2", "Triumph Street Triple RS"],
    warranty: "Fits Brembo Monobloc Calipers",
    shipping: "Free Dispatch inside 24 Hours",
    specs: ["Sintered Compound", "Track Focus", "High Friction Coef."],
    options: ["Front Set", "Rear Set", "Full Set"],
    stockCount: 15,
    relatedThumbs: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=150&q=80"]
  },
  {
    slug: "bmw-motorrad-pro-tank-bag",
    name: "BMW Motorrad Pro Waterproof Tank Bag",
    category: "Luggage",
    brand: "BMW",
    price: 2499,
    rating: 4.9,
    availability: "In Stock",
    badge: "Touring",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
    description: "Fully waterproof tank bag with absolute seal zippers, magnetic quick-mount base system, and expandable volume. Perfect for long-distance adventure touring.",
    compatibility: ["BMW R 1250 GS / R 1300 GS", "BMW F 900 GS", "BMW G 310 GS"],
    warranty: "2 Years BMW Motorrad Warranty",
    shipping: "Free Pan India Delivery in 2-3 Days",
    specs: ["100% Waterproof", "15L Volume", "Magnetic Mount"],
    options: ["11L Standard", "15L Pro"],
    stockCount: 8,
    relatedThumbs: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80"]
  },
  {
    slug: "puig-racing-windscreen-z-racing",
    name: "Puig Z-Racing Double Bubble Windscreen",
    category: "Windscreen",
    brand: "Triumph",
    price: 950,
    rating: 4.7,
    availability: "In Stock",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=900&q=80",
    description: "Designed in the virtual wind tunnel to improve aerodynamics and wind protection on average by 12.7%. Derived straight from WSBK competition.",
    compatibility: ["Triumph Daytona 675", "Triumph Street Triple 765", "Triumph Speed Triple"],
    warranty: "1 Year Manufacturer Warranty",
    shipping: "Free Delivery in 3-4 Days",
    specs: ["3mm High Impact Acrylic", "TUV Approved", "Double Bubble Design"],
    options: ["Dark Smoke", "Light Smoke", "Clear"],
    stockCount: 22,
    relatedThumbs: ["https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=150&q=80"]
  },
  {
    slug: "pirelli-diablo-supercorsa-sp-v3",
    name: "Pirelli Diablo Supercorsa SP V3 Front & Rear Tyres",
    category: "Tyres",
    brand: "Ducati",
    price: 3450,
    rating: 5.0,
    availability: "Limited",
    badge: "Track Spec",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80",
    description: "The ultimate street-legal track tyre. Features World Superbike derived compounds and profiles for maximum lean angles and cornering grip.",
    compatibility: ["Ducati Panigale V4", "Kawasaki Ninja ZX-10R", "BMW S 1000 RR", "Aprilia RSV4"],
    warranty: "Manufacturer Warranty",
    shipping: "Heavy item shipping in 5-7 Days",
    specs: ["WSBK Compound", "W-Rated", "Bi-Compound Rear"],
    options: ["120/70 & 200/55", "120/70 & 200/60", "120/70 & 190/55"],
    stockCount: 5,
    relatedThumbs: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=150&q=80"]
  },
  {
    slug: "quad-lock-motorcycle-mount-pro",
    name: "Quad Lock Motorcycle Mount PRO",
    category: "Phone mount",
    brand: "Accessories",
    price: 650,
    rating: 4.8,
    availability: "In Stock",
    badge: "Must Have",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
    description: "The most secure and convenient smartphone mount for motorcycles. PRO version features CNC machined aluminium construction and black hardware.",
    compatibility: ["All Motorcycles (Handlebar mount)"],
    warranty: "1 Year Warranty",
    shipping: "Free Dispatch inside 24 Hours",
    specs: ["CNC Aluminium", "Patented Dual-Stage Lock", "Vibration Dampener Ready"],
    options: ["Handlebar Mount", "Fork Stem Mount", "Mirror Mount"],
    stockCount: 45,
    relatedThumbs: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=150&q=80"]
  }
];

export const testimonials = [
  {
    name: "Arjun Mehta",
    bike: "KTM 390 Duke",
    location: "Mumbai",
    rating: 5,
    review: "The Puig windscreen arrived in 2 days, packaging was immaculate. Quality is on another level — feels exactly like what you'd buy at a European dealer. Octane is my go-to now.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Priya Nair",
    bike: "Royal Enfield Interceptor 650",
    location: "Bengaluru",
    rating: 5,
    review: "Finally a store that stocks genuine protection parts. The crash guards fit perfectly and the customer support helped me pick the right model. Absolutely premium experience from start to finish.",
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

export const articles = [
  {
    id: 1,
    title: "How to Choose a Performance Exhaust Without Losing Rideability",
    description: "A practical guide to materials, maps, torque curves and noise limits.",
    slug: "choosing-performance-exhaust",
    image: "https://images.pexels.com/photos/9606857/pexels-photo-9606857.jpeg?auto=compress&cs=tinysrgb&w=2560",
    category: "Performance",
    author: "Rahul Sharma",
    publishDate: "Jan 15, 2026",
    readTime: 5,
    featured: true,
    content: "Full article content goes here..."
  },
  {
    id: 2,
    title: "The Modern Street Setup: Luggage, Lighting and Cockpit Tech",
    description: "Build a superbike that stays calm, visible and useful when the miles stack up.",
    slug: "street-bike-setup",
    image: "https://images.pexels.com/photos/33469791/pexels-photo-33469791.jpeg?auto=compress&cs=tinysrgb&w=2560",
    category: "Street",
    author: "Priya Nair",
    publishDate: "Jan 12, 2026",
    readTime: 4,
    featured: false,
    content: "Full article content goes here..."
  },
  {
    id: 3,
    title: "Brake Pad Compounds Explained for Street and Track Riders",
    description: "What sintered, ceramic and organic pads actually change at the lever.",
    slug: "brake-pad-compounds",
    image: "https://images.pexels.com/photos/5450167/pexels-photo-5450167.jpeg?auto=compress&cs=tinysrgb&w=2560",
    category: "Maintenance",
    author: "Vikram Patel",
    publishDate: "Jan 05, 2026",
    readTime: 6,
    featured: false,
    content: "Full article content goes here..."
  },
  {
    id: 4,
    title: "Mastering Track Days: Essential Bike Prep",
    description: "Suspension tuning, tire pressures, and safety wiring your machine for the circuit.",
    slug: "mastering-track-days",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=2560&q=90",
    category: "Track",
    author: "Arjun Mehta",
    publishDate: "Dec 28, 2025",
    readTime: 8,
    featured: false,
    content: "Full article content goes here..."
  },
  {
    id: 5,
    title: "Upgrading Your Motorcycle's Electronics Suite",
    description: "Demystifying quickshifters, auto-blippers, and aftermarket ECU flashes.",
    slug: "electronics-suite-upgrade",
    image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=2560&q=90",
    category: "Electronics",
    author: "Sneha Kulkarni",
    publishDate: "Dec 15, 2025",
    readTime: 7,
    featured: false,
    content: "Full article content goes here..."
  }
];
