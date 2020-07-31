const rp = require("request-promise");
const cheerio = require("cheerio");

async function getResult(ip) {
  let data = await rp(`https://scamalytics.com/ip/${ip}`);

  const $ = cheerio.load(data);
  let score = parseInt($(".score").text().split(":")[1]);

  let status = [];
  $(".risk.yes").each((index, element) => {
    status.push($(element).parent().prev().text());
  });

  return {
    name: "Scam Analytics",
    type: "IP/VPN",
    status: status.join(", "),
    score: score,
  };
}

module.exports = getResult;
