const xlsx = require('xlsx');

const workbook = xlsx.readFile('c:/Users/Shivam Khade/Downloads/octane-powersports/lib/Octane_Product_Data 07TH JUNE 2026 MODIFIED.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);
console.log("Headers:", Object.keys(data[0] || {}));
console.log("First 2 rows:", JSON.stringify(data.slice(0, 2), null, 2));
console.log("Total rows:", data.length);
