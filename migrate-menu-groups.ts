import mysql from 'mysql2/promise';

(async () => {
  try {
    const pool = mysql.createPool({
      host: "8.222.144.67",
      port: 4000,
      user: "4RhtAbe8Eb2KPAq.root",
      password: "jt76nPfpNOqadLCD",
      database: "octane_db",
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
        servername: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com"
      }
    });

    console.log("Creating menu_groups table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE,
        sort_order INT DEFAULT 0
      )
    `);

    console.log("Adding menu_group_id to categories...");
    try {
      await pool.query(`ALTER TABLE categories ADD COLUMN menu_group_id INT DEFAULT NULL`);
    } catch (e: any) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        throw e;
      }
    }

    console.log("Inserting default menu groups...");
    const groups = [
      "ENGINE & EXHAUST",
      "BRAKES & SUSPENSION",
      "DRIVETRAIN",
      "ELECTRONICS & LIGHTING",
      "ACCESSORIES & LUGGAGE",
      "MAINTENANCE"
    ];

    for (let i = 0; i < groups.length; i++) {
      await pool.query(`INSERT IGNORE INTO menu_groups (name, sort_order) VALUES (?, ?)`, [groups[i], i]);
    }

    console.log("Mapping categories to menu groups...");
    const mappings: Record<string, string[]> = {
      "ENGINE & EXHAUST": [
        "Air Filters", 
        "Engine Oil", 
        "Oil Filters",
        "Coolant", 
        "Exhausts Systems"
      ],
      "BRAKES & SUSPENSION": [
        "Brake Pads", 
        "Fork Seals"
      ],
      "DRIVETRAIN": [
        "Chain Sprockets"
      ],
      "ELECTRONICS & LIGHTING": [
        "Electronics", 
        "Aux Lights", 
        "LED Bulbs", 
        "Indicators", 
        "Gps"
      ],
      "ACCESSORIES & LUGGAGE": [
        "Luggage", 
        "Phone Mount", 
        "Tank Grip", 
        "Tank Pads",
        "Traction Pads",
        "Dash Protectors", 
        "Hand Guards", 
        "Handle Grips", 
        "Protection Parts",
        "Windscreen"
      ],
      "MAINTENANCE": [
        "General Maintenance",
        "Air Filter Maintainance",
        "Chain Maintainance",
        "Suspension Maintainance"
      ]
    };

    for (const [group, cats] of Object.entries(mappings)) {
      const [rows] = await pool.query(`SELECT id FROM menu_groups WHERE name = ?`, [group]);
      const groupId = (rows as any[])[0]?.id;
      if (groupId) {
        for (const cat of cats) {
          await pool.query(`UPDATE categories SET menu_group_id = ? WHERE name = ?`, [groupId, cat]);
        }
      }
    }
    
    console.log("Migration complete!");
    await pool.end();
  } catch (error) {
    console.error("Migration error:", error);
  }
})();
