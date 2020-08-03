const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

try {
    axios.get('https://www.myip.ms/files/blacklist/htaccess/latest_blacklist.txt').then((response) => {
    // const $ = cheerio.load(response.data);
    const dt = response.data.split('\n\n')[1].split('\n');
    let s = ""
    for(let i in dt) {
        if(i == dt.length - 1) continue
        s += String(dt[i].split("from")[1]).trim() + '\n'
    }

    fs.writeFileSync("./scrapers/blacklists/Myip.ms Blacklist.txt", s, 'utf8');
    })
}
catch(e) {}