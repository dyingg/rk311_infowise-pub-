const axios = require('axios')
const fs = require('fs')

axios.get('https://lists.blocklist.de/lists/all.txt').then((response) => {
        
    fs.writeFileSync("./scrapers/blacklists/Blocklist_de.txt", response.data, 'utf8');
})