const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

try {
    axios.get('https://feodotracker.abuse.ch/downloads/ipblocklist.csv').then((response) => {
    // const $ = cheerio.load(response.data);
    const dt = response.data.split("Malware")[1].split('\n');
    let s = ""
    for(let i in dt) {
        if(i == 0 || i == dt.length - 1) continue;
        s += String(dt[i].split(",")[1] + '\n')
    }

    fs.writeFileSync("./scrapers/blacklists/Feodo Tracker.txt", s, 'utf8');
    })
}
catch(e) {}