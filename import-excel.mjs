import * as xlsx from 'xlsx';
import mysql from 'mysql2/promise';

async function importData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'octane_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const workbook = xlsx.readFile('c:/Users/Shivam Khade/Downloads/octane-powersports/lib/Octane_Product_Data 07TH JUNE 2026 MODIFIED.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet);
  
  for (const row of data) {
    const name = row['Product Name'] || 'Unknown Product';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = row['Category'] || 'Uncategorized';
    const brand = row['Brand'] || 'Unknown Brand';
    const price = row['Price (MRP)'] || 0;
    const stockCount = row['Stock Quantity'] || 0;
    const description = row['Short Description'] || '';
    const compatibilityStr = row['Vehicle Compatibility (Optional)'] || '';
    
    const compatibility = compatibilityStr ? compatibilityStr.split('/').map(s => s.trim()).filter(Boolean) : [];
    
    // Check if product already exists
    const [existing] = await pool.query('SELECT id FROM products WHERE slug = ?', [slug]);
    
    if (existing.length > 0) {
      console.log(`Skipping ${name} (already exists)`);
      continue;
    }

    try {
      await pool.query(`
        INSERT INTO products 
        (name, slug, category, brand, price, rating, availability, badge, image, description, stockCount, compatibility, specs, options, relatedThumbs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]')
      `, [
        name, 
        slug, 
        category, 
        brand, 
        price, 
        5.0, 
        stockCount > 0 ? 'In Stock' : 'Out of Stock', 
        '', 
        '', // No image in excel
        description, 
        stockCount, 
        JSON.stringify(compatibility)
      ]);
      console.log(`Imported: ${name}`);
    } catch (e) {
      console.error(`Error importing ${name}:`, e.message);
    }
  }

  await pool.end();
}

importData().then(() => console.log('Done.')).catch(console.error);
