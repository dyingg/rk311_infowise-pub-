const rp = require("request-promise");
const cheerio = require("cheerio");

async function getResult(ip) {
  let data = await rp("https://ip.teoh.io/vpn-detection", {
    method: "POST",
    headers: {
      "Cache-Control": " max-age=0",
      "Upgrade-Insecure-Requests": " 1",
      Origin: " https://ip.teoh.io",
      "Content-Type": " application/x-www-form-urlencoded",
      "User-Agent":
        " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
      Accept:
        " text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Sec-Fetch-Site": " same-origin",
      "Sec-Fetch-Mode": " navigate",
      "Sec-Fetch-User": " ?1",
      "Sec-Fetch-Dest": " document",
      Referer: " https://ip.teoh.io/vpn-detection",
      "Accept-Language": " en-US,en;q=0.9",
    },
    gzip: true,
    form: {
      ip,
      vpnsubmit: "Submit",
    },
  });

  const $ = cheerio.load(data);
  let result = $($("h2")[1]).text().trim();
  let status = $($("h3")[0]).text().trim();

  return {
    name: "IPToeh",
    type: "IP/VPN",
    status,
    score: result == "No VPN/Proxy Detected" ? 0 : 100,
  };
}

module.exports = getResult;
