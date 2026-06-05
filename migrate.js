import mysql from 'mysql2/promise';
import { products, articles } from './lib/data.js';

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'octane_db',
  });

  try {
    console.log('Creating tables...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        rating DECIMAL(3,1) DEFAULT 5.0,
        availability VARCHAR(50) DEFAULT 'In Stock',
        badge VARCHAR(50) DEFAULT '',
        image VARCHAR(1000) NOT NULL,
        description TEXT,
        compatibility JSON,
        warranty VARCHAR(255),
        shipping VARCHAR(255),
        specs JSON,
        options JSON,
        stockCount INT DEFAULT 10,
        relatedThumbs JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(1000) NOT NULL,
        category VARCHAR(100) NOT NULL,
        author VARCHAR(100) NOT NULL,
        publishDate VARCHAR(100) NOT NULL,
        readTime INT NOT NULL,
        featured BOOLEAN DEFAULT false,
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Inserting products...');
    for (const p of products) {
      await pool.query(
        `INSERT IGNORE INTO products 
         (slug, name, category, brand, price, rating, availability, badge, image, description, compatibility, warranty, shipping, specs, options, stockCount, relatedThumbs) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.slug, p.name, p.category, p.brand, p.price, p.rating, p.availability, p.badge, p.image,
          p.description || "",
          JSON.stringify(p.compatibility || []),
          p.warranty || "",
          p.shipping || "",
          JSON.stringify(p.specs || []),
          JSON.stringify(p.options || []),
          p.stockCount || 10,
          JSON.stringify(p.relatedThumbs || [])
        ]
      );
    }

    console.log('Inserting blogs...');
    for (const b of articles) {
      await pool.query(
        `INSERT IGNORE INTO blogs
         (title, description, slug, image, category, author, publishDate, readTime, featured, content)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.title, b.description, b.slug, b.image, b.category, b.author, b.publishDate, b.readTime, b.featured ? 1 : 0, b.content
        ]
      );
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
