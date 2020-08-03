const axios = require('axios')
const fs = require('fs')

try{
    axios.get('https://www.botvrij.eu/data/ioclist.ip-dst').then((response) => {
        let s = response.data.split('# See : http://www.botvrij.eu\n#')[1].split('\n');
        let str = '';
        for(i in s) {
            if(i == 0) continue
            str += s[i].split(' #')[0] + '\n';
        }
        fs.writeFileSync("./scrapers/blacklists/botvrij.eu.txt", str, 'utf8');
    })
}
catch {}