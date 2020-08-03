const axios = require('axios')
const fs = require('fs')

axios.get('https://www.threatsourcing.com/ipall-free.txt').then((response) => {
        
    fs.writeFileSync("./scrapers/blacklists/Threat Sourcing.txt", response.data, 'utf8');
})