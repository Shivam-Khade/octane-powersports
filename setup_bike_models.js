import mysql from 'mysql2/promise';

const bikeModels = [
  {
    brand: "Yamaha",
    series: [
      { name: "R Series", models: ["Yamaha R15 V3", "Yamaha R15 V4", "Yamaha R3", "Yamaha R1"] },
      { name: "MT Series", models: ["Yamaha MT-15", "Yamaha MT-03", "Yamaha MT-07", "Yamaha MT-09"] }
    ]
  },
  {
    brand: "KTM",
    series: [
      { name: "Duke", models: ["KTM 125 Duke", "KTM 200 Duke", "KTM 250 Duke", "KTM 390 Duke"] },
      { name: "RC", models: ["KTM RC 125", "KTM RC 200", "KTM RC 390"] },
      { name: "Adventure", models: ["KTM 250 Adventure", "KTM 390 Adventure"] }
    ]
  },
  {
    brand: "Royal Enfield",
    series: [
      { name: "Twins", models: ["Royal Enfield Interceptor 650", "Royal Enfield Continental GT 650"] },
      { name: "Classic & Bullet", models: ["Royal Enfield Classic 350", "Royal Enfield Bullet 350"] },
      { name: "Adventure", models: ["Royal Enfield Himalayan 411", "Royal Enfield Himalayan 450"] }
    ]
  },
  {
    brand: "Kawasaki",
    series: [
      { name: "Ninja", models: ["Kawasaki Ninja 300", "Kawasaki Ninja 400", "Kawasaki Ninja 650", "Kawasaki Ninja 1000", "Kawasaki ZX-10R"] },
      { name: "Z Series", models: ["Kawasaki Z650", "Kawasaki Z900"] }
    ]
  },
  {
    brand: "BMW",
    series: [
      { name: "G Series", models: ["BMW G 310 R", "BMW G 310 GS"] },
      { name: "S Series", models: ["BMW S 1000 RR", "BMW S 1000 XR"] }
    ]
  },
  {
    brand: "Triumph",
    series: [
      { name: "Roadsters", models: ["Triumph Street Triple", "Triumph Speed Triple"] },
      { name: "Modern Classics", models: ["Triumph Bonneville T100", "Triumph Bonneville T120"] },
      { name: "Adventure", models: ["Triumph Tiger 850 Sport", "Triumph Tiger 900"] }
    ]
  },
  {
    brand: "Universal",
    series: [
      { name: "All Bikes", models: ["Universal"] }
    ]
  }
];

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    console.log('Creating bike_models table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bike_models (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        series VARCHAR(100) NOT NULL,
        model VARCHAR(255) NOT NULL,
        UNIQUE KEY idx_unique_model (brand, series, model)
      );
    `);

    console.log('Inserting bike models...');
    for (const brandObj of bikeModels) {
      for (const seriesObj of brandObj.series) {
        for (const model of seriesObj.models) {
          await pool.query(
            `INSERT IGNORE INTO bike_models (brand, series, model) VALUES (?, ?, ?)`,
            [brandObj.brand, seriesObj.name, model]
          );
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
