const fs = require('fs');
const path = require('path');

// Get API URL from environment variable or use default
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create config content
const configContent = `window.REACT_APP_API_URL = '${apiUrl}';`;

// Write to public directory
const configPath = path.join(__dirname, '../public/config.js');
fs.writeFileSync(configPath, configContent);

console.log(`Config file generated with API URL: ${apiUrl}`); 