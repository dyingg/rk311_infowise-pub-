//http://danger.rulez.sk/projects/bruteforceblocker/blist.php
const axios = require('axios')
const fs = require('fs')
try {
    axios.get('http://danger.rulez.sk/projects/bruteforceblocker/blist.php').then((response) => {
        let s = response.data.split('ID\n')[1].split('\n');
        let str = '';
        for(i in s) {
            // if(i == 0) continue
            str += s[i].split(' ')[0].split('#')[0].trim() + '\n';
        }
        fs.writeFileSync("./scrapers/blacklists/Brute Force Blocker.txt", str, 'utf8');
    })
}
catch(e){console.log(e)}