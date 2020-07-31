const rp = require("request-promise");
const { get } = require("request-promise");

async function getResult(ip) {
  let data = await rp(`https://www.iphunter.info:8082/v1/ip/${ip}`, {
    headers: {
      "X-Key":
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Wzk2MywxNTkyODk3MzIyLDIwMDBd.F7hVQuBgJ7ZcFjklhrpMCG5nawYqKic8VDwVeloVs2s",
    },
  });

  const result = JSON.parse(data).data;

  if (result.block == 1) {
    return {
      name: "IPHunter",
      type: "IP/VPN",
      status: "Hosting, proxy or bad IP",
      score: 100,
    };
  } else {
    return {
      name: "IPHunter",
      type: "IP/VPN",
      status: "Proxy not detected",
      score: 0,
    };
  }
}

module.exports = getResult;
