const rp = require("request-promise");
const { get } = require("request-promise");

async function getResult(ip) {
  let data = await rp(
    `https://ipqualityscore.com/api/json/ip/kW0DgMEwjjBQxRAw2pZoYmyoTcPhQsgZ/${ip}`,
    {}
  );

  const result = JSON.parse(data);

  if (result.active_vpn || result.proxy) {
    return {
      name: "IPQualityScore",
      type: "IP/VPN",
      status: "Hosting, proxy or bad IP",
      score: result.fraud_score,
    };
  } else {
    return {
      name: "IPHunter",
      type: "IP/VPN",
      status: "Proxy VPN N/D",
      score: result.fraud_score,
    };
  }
}

module.exports = getResult;
