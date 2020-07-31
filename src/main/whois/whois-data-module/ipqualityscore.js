const fs = require("fs");
const cheerio = require("cheerio");

const data = fs.readFileSync("./sites/ipqualityscore/valid.html", "utf-8");

function ipqualityscore() {
    const $ = cheerio.load(data);

    const score = $($($("td")[5]).find("span")[0]).text().split("-")[0];

    return score;
}

function ipqualitystatus() {
    const $ = cheerio.load(data);

    const status = $($("td")[9]).text().split("This")[0].trim();

    return status;
}

console.log("SCORE = " + parseInt(ipqualityscore()));
console.log("STATUS = " + ipqualitystatus());