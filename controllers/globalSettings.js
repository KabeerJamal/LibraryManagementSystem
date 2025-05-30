const db = require('../db'); // Your database module

// Global object to store settings
const globalSettings = {};

// Function to fetch and load settings
async function loadSettings() {
    try {
        const query = 'SELECT key_name, value FROM settings';
        const [rows] = await db.query(query);
        rows.forEach(row => {
            globalSettings[row.key_name] = row.value;
        });
        console.log('Settings loaded:', globalSettings);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// ✅ Export both the function and the object
module.exports = { globalSettings, loadSettings };
