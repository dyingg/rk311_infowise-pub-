//http://www.unsubscore.com/blacklist.txt
const axios = require('axios')
const fs = require('fs')

try {
    axios.get('http://www.unsubscore.com/blacklist.txt').then((response) => {
        fs.writeFileSync("./scrapers/blacklists/Lashback UBL.txt", response.data, 'utf8');
    })
}
catch{}