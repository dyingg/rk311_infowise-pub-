//https://sblam.com/blacklist.txt
const axios = require('axios')
const fs = require('fs')

axios.get('https://sblam.com/blacklist.txt').then((response) => {
    let s = response.data.split('\n');
    let str = '', str1 = '';
    for(i in s) {
        if(s[i].includes('#')){
            continue;
        }
        else {
            str1 += s[i] + '\n';
        }
    }
    fs.writeFileSync("./scrapers/blacklists/Sblam.txt", str1, 'utf8');
    //fs.writeFileSync("../blacklists/Anti-Attacks BL range.txt", str, 'utf8');
})