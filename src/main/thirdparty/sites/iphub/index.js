const rp = require("request-promise");
const { get } = require("request-promise");

async function getResult(ip) {
  let data = await rp(
    `https://v2.api.iphub.info/guest/ip/${ip}?c=Fae9gi8a${ip}`
  );

  const result = JSON.parse(data);

  if (result.block == 1) {
    return {
      name: "IPHub",
      type: "IP/VPN",
      status: "Hosting, proxy or bad IP",
      score: 100,
    };
  } else {
    return {
      name: "IPHub",
      type: "IP/VPN",
      status: "Proxy not detected",
      score: 0,
    };
  }
}

module.exports = getResult;
