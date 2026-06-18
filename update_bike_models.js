import mysql from 'mysql2/promise';

const bikeModels = [
  {
    brand: "KTM",
    series: [
      { name: "Duke", models: ["125 Duke", "200 Duke", "250 Duke", "390 Duke"] },
      { name: "RC", models: ["RC 125", "RC 200", "RC 390"] },
      { name: "Adventure", models: ["250 Adventure", "390 Adventure"] }
    ]
  },
  {
    brand: "Royal Enfield",
    series: [
      { name: "Classic & Bullet", models: ["Classic 350", "Bullet 350"] },
      { name: "Cruisers", models: ["Meteor 350", "Super Meteor 650", "Shotgun 650"] },
      { name: "Roadsters", models: ["Hunter 350"] },
      { name: "Adventure", models: ["Himalayan 411", "Himalayan 450", "Scram 411"] },
      { name: "Twins", models: ["Interceptor 650", "Continental GT 650"] }
    ]
  },
  {
    brand: "Triumph",
    series: [
      { name: "400cc", models: ["Speed 400", "Scrambler 400 X"] },
      { name: "Roadsters", models: ["Trident 660", "Street Triple 765 R", "Street Triple 765 RS", "Speed Triple 1200 RS"] },
      { name: "Modern Classics", models: ["Bonneville T100", "Bonneville T120", "Speed Twin 900", "Speed Twin 1200", "Scrambler 900", "Scrambler 1200"] },
      { name: "Adventure", models: ["Tiger Sport 660", "Tiger 850 Sport", "Tiger 900 GT", "Tiger 900 Rally", "Tiger 1200"] }
    ]
  },
  {
    brand: "Kawasaki",
    series: [
      { name: "Ninja", models: ["Ninja 300", "Ninja 400", "Ninja 500", "Ninja 650", "Ninja 1000SX", "Ninja ZX-4R", "Ninja ZX-6R", "Ninja ZX-10R"] },
      { name: "Z Series", models: ["Z650", "Z900", "Z900RS"] },
      { name: "Versys", models: ["Versys 650"] },
      { name: "Vulcan", models: ["Vulcan S"] }
    ]
  },
  {
    brand: "BMW",
    series: [
      { name: "G Series", models: ["G 310 R", "G 310 GS", "G 310 RR"] },
      { name: "F Series", models: ["F 900 R", "F 900 XR", "F 850 GS"] },
      { name: "R Series", models: ["R 1250 GS", "R 1300 GS", "R 1250 RT"] },
      { name: "S Series", models: ["S 1000 R", "S 1000 RR", "S 1000 XR", "M 1000 RR"] }
    ]
  },
  {
    brand: "Ducati",
    series: [
      { name: "Scrambler", models: ["Scrambler Icon", "Scrambler Nightshift", "Scrambler Full Throttle"] },
      { name: "Monster", models: ["Monster", "Monster SP"] },
      { name: "Multistrada", models: ["Multistrada V2", "Multistrada V4", "Multistrada V4 S"] },
      { name: "Panigale", models: ["Panigale V2", "Panigale V4", "Panigale V4 S"] },
      { name: "Streetfighter", models: ["Streetfighter V2", "Streetfighter V4"] },
      { name: "Diavel", models: ["Diavel V4"] }
    ]
  },
  {
    brand: "Yamaha",
    series: [
      { name: "R Series", models: ["R15 V3", "R15 V4", "R15M", "R3"] },
      { name: "MT Series", models: ["MT-15 V2", "MT-03"] },
      { name: "FZ Series", models: ["FZ-S V3", "FZ-S V4", "FZ-X"] }
    ]
  },

];

async function run() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shivam10@162006',
    database: 'octane_db',
  });

  try {
    console.log('Truncating existing bike models...');
    await pool.query('TRUNCATE TABLE bike_models');

    console.log('Inserting real Indian market bike models...');
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

    console.log('Update completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
