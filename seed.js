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
