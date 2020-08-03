const axios = require('axios')
const fs = require('fs')

axios.get('https://blocklist.greensnow.co/greensnow.txt').then((response) => {
        
    fs.writeFileSync("./scrapers/blacklists/Green Snow Blocklist.txt", response.data, 'utf8');
})