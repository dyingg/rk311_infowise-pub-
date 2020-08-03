const axios = require('axios')
const fs = require('fs')

try {
    axios.get('https://bl.isx.fr/raw').then((response) => {
        fs.writeFileSync("./scrapers/blacklists/ISX.fr DNSBL.txt", response.data, 'utf8');
    })
}
catch{}