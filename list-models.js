const https = require('https');
const fs = require('fs');

const apiKey = 'AIzaSyCxIGpty5CTmQV298hCgJxXcluldxO0DdA';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('models.json', data);
        console.log("Models saved to models.json");
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
