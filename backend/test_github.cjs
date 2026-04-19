const https = require('https');
const client_id = "Ov23li3pCAWWtwKCPSwF";
const uri = encodeURIComponent("http://localhost:3000/api/auth/github/callback");
const url = `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&client_id=${client_id}`;
https.get(url, (res) => {
    console.log(`GitHub Auth Status: ${res.statusCode}`);
    if (res.statusCode === 302 || res.statusCode === 200) {
       console.log(`Location: ${res.headers.location}`);
    }
}).on('error', (e) => {
    console.error(e);
});
