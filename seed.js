import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    console.log('Deleting all existing products...');
    await pool.query('DELETE FROM products');
    
    // Reset auto increment
    await pool.query('ALTER TABLE products AUTO_INCREMENT = 1');
    
    const newProducts = [
      {
        slug: "eazi-grip-pro-tank-pads",
        name: "Eazi-Grip Pro Tank Pads",
        category: "Eazi grip",
        brand: "Eazi-Grip",
        price: 3500,
        rating: 4.8,
        availability: "In Stock",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        description: "Premium polyurethane tank grips designed for maximum control and reduced rider fatigue under heavy braking and cornering.",
        stockCount: 15
      },
      {
        slug: "kn-high-flow-air-filter",
        name: "K&N High-Flow Air Filter",
        category: "K&N",
        brand: "K&N",
        price: 6500,
        rating: 4.9,
        availability: "In Stock",
        badge: "Performance",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        description: "Washable, reusable high-flow air filter designed to improve horsepower and acceleration while providing excellent filtration.",
        stockCount: 20
      },
      {
        slug: "brembo-rcs19-corsa-corta",
        name: "Brembo RCS19 Corsa Corta Master Cylinder",
        category: "Brembo",
        brand: "Brembo",
        price: 32000,
        rating: 5.0,
        availability: "Limited",
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        description: "The pinnacle of radial master cylinder technology, offering adjustable bite point for track and street use.",
        stockCount: 4
      },
      {
        slug: "rg-aero-crash-protectors",
        name: "R&G Aero Crash Protectors",
        category: "R&G",
        brand: "R&G",
        price: 12500,
        rating: 4.7,
        availability: "In Stock",
        badge: "Protection",
        image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=800&q=80",
        description: "Industry-leading crash protection pucks designed to save your frame and fairings in the event of a drop or slide.",
        stockCount: 12
      },
      {
        slug: "pirelli-diablo-supercorsa-sp-v3",
        name: "Pirelli Diablo Supercorsa SP V3 Tyres",
        category: "Pirelli",
        brand: "Pirelli",
        price: 38000,
        rating: 5.0,
        availability: "In Stock",
        badge: "Track Ready",
        image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
        description: "Street-legal track tyres offering unprecedented grip, handling, and cornering stability for high-performance superbikes.",
        stockCount: 8
      },
      {
        slug: "engine-ice-hi-performance-coolant",
        name: "Engine Ice Hi-Performance Coolant",
        category: "Engine ice",
        brand: "Engine Ice",
        price: 2200,
        rating: 4.9,
        availability: "In Stock",
        badge: "Consumable",
        image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80",
        description: "Biodegradable, phosphate-free coolant proven to reduce operating temperatures and prevent boil-over in extreme riding conditions.",
        stockCount: 50
      },
      {
        slug: "puig-racing-windscreen",
        name: "Puig Racing Windscreen",
        category: "Windscreen",
        brand: "Puig",
        price: 9500,
        rating: 4.8,
        availability: "In Stock",
        badge: "Aero",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        description: "High impact acrylic windscreen designed to reduce wind fatigue and improve aerodynamic efficiency.",
        stockCount: 15
      },
      {
        slug: "speedo-angels-dash-protector",
        name: "Speedo Angels Dash Protector",
        category: "Dash protectors",
        brand: "Speedo Angels",
        price: 1800,
        rating: 4.5,
        availability: "In Stock",
        badge: "Essential",
        image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=800&q=80",
        description: "Anti-glare screen protector to prevent scratches and UV damage to your expensive TFT dashboard.",
        stockCount: 40
      },
      {
        slug: "denali-d4-aux-lights",
        name: "Denali D4 Aux Lights",
        category: "Aux lights",
        brand: "Denali",
        price: 35000,
        rating: 5.0,
        availability: "Limited",
        badge: "Visibility",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        description: "Extremely powerful LED auxiliary driving lights to turn night into day on dark trails.",
        stockCount: 5
      },
      {
        slug: "sw-motech-trax-adv-panniers",
        name: "SW-Motech TRAX ADV Panniers",
        category: "Luggage",
        brand: "SW-Motech",
        price: 85000,
        rating: 4.9,
        availability: "In Stock",
        badge: "Touring",
        image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
        description: "Premium aluminum touring cases designed for extreme off-road durability and waterproofing.",
        stockCount: 8
      },
      {
        slug: "healtech-quickshifter-easy",
        name: "HealTech QuickShifter Easy",
        category: "Electronics",
        brand: "HealTech",
        price: 28000,
        rating: 4.7,
        availability: "In Stock",
        badge: "Performance",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        description: "Next-gen standalone quickshifter module controllable via Bluetooth for seamless clutchless upshifts.",
        stockCount: 12
      },
      {
        slug: "quad-lock-pro-mount",
        name: "Quad Lock Pro Motorcycle Mount",
        category: "Phone mount",
        brand: "Quad Lock",
        price: 6500,
        rating: 4.9,
        availability: "In Stock",
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80",
        description: "The most secure smartphone mount for motorcycles, featuring a dual-stage locking mechanism and vibration dampener.",
        stockCount: 50
      },
      {
        slug: "garmin-zumo-xt",
        name: "Garmin Zumo XT",
        category: "GPS",
        brand: "Garmin",
        price: 45000,
        rating: 4.8,
        availability: "Limited",
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        description: "Rugged motorcycle navigator with an ultrabright 5.5-inch display, preloaded topography, and turn-by-turn routing.",
        stockCount: 6
      },
      {
        slug: "barkbusters-vps-handguards",
        name: "Barkbusters VPS Handguards",
        category: "Hand guards",
        brand: "Barkbusters",
        price: 12500,
        rating: 4.9,
        availability: "In Stock",
        badge: "Protection",
        image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=800&q=80",
        description: "Heavy-duty aluminum backbones with interchangeable plastic guards for ultimate lever and hand protection.",
        stockCount: 20
      },
      {
        slug: "cyclops-h4-led-bulb",
        name: "Cyclops 10.0 H4 LED Bulb",
        category: "Led bulbs",
        brand: "Cyclops",
        price: 7500,
        rating: 4.6,
        availability: "In Stock",
        badge: "Upgrade",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        description: "Ultra-bright plug-and-play LED headlight replacement offering vastly improved night visibility.",
        stockCount: 30
      },
      {
        slug: "koso-apollo-heated-grips",
        name: "Koso Apollo Heated Grips",
        category: "Handle grips",
        brand: "Koso",
        price: 14500,
        rating: 4.7,
        availability: "In Stock",
        badge: "Comfort",
        image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
        description: "Integrated heated grips with a built-in thumb switch and 5 temperature levels for cold weather riding.",
        stockCount: 15
      },
      {
        slug: "stomp-grip-traction-pads",
        name: "StompGrip Traction Pads",
        category: "Traction pads",
        brand: "StompGrip",
        price: 6500,
        rating: 4.5,
        availability: "In Stock",
        badge: "Grip",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        description: "Aggressive volcano profile traction pads designed to lock your knees in during heavy braking.",
        stockCount: 25
      },
      {
        slug: "skf-fork-seal-kit",
        name: "SKF Fork Seal Kit",
        category: "Fork seals",
        brand: "SKF",
        price: 3500,
        rating: 4.9,
        availability: "In Stock",
        badge: "Maintenance",
        image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80",
        description: "Low-friction fork seals offering superior sealing performance and significantly reduced stiction.",
        stockCount: 40
      },
      {
        slug: "did-vx3-chain",
        name: "DID 525 VX3 Chain",
        category: "Chain sprockets",
        brand: "DID",
        price: 11500,
        rating: 4.8,
        availability: "In Stock",
        badge: "Drivetrain",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        description: "High-performance X-Ring drive chain offering extended lifespan and reduced friction for modern sportbikes.",
        stockCount: 18
      },
      {
        slug: "akrapovic-slip-on",
        name: "Akrapovic Slip-On Exhaust",
        category: "Exhausts systems",
        brand: "Akrapovic",
        price: 65000,
        rating: 5.0,
        availability: "Limited",
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=800&q=80",
        description: "Titanium slip-on silencer delivering pure racing sound, weight reduction, and noticeable power gains.",
        stockCount: 3
      },
      {
        slug: "rizoma-vision-indicators",
        name: "Rizoma Vision Indicators",
        category: "Indicators",
        brand: "Rizoma",
        price: 8500,
        rating: 4.6,
        availability: "In Stock",
        badge: "Aesthetics",
        image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
        description: "Sleek, CNC-machined sequential LED turn signals offering a clean look and high visibility.",
        stockCount: 22
      }
    ];

    console.log('Inserting new category products...');
    for (const p of newProducts) {
      await pool.query(
        `INSERT INTO products 
         (slug, name, category, brand, price, rating, availability, badge, image, description, stockCount, compatibility, specs, options, relatedThumbs) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]', '[]')`,
        [
          p.slug, p.name, p.category, p.brand, p.price, p.rating, p.availability, p.badge, p.image,
          p.description,
          p.stockCount
        ]
      );
    }
    
    console.log('Database successfully seeded with new products!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
