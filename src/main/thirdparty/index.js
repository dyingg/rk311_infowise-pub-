//Expose a single function to get third party status

const iptoeh = require("./sites/iptoeh/index");
const scamanalytics = require("./sites/scamanalytics/index");
const iphub = require("./sites/iphub/index");

const ipqualityScore = require("./sites/ipquality/index");

const supported = [iptoeh, scamanalytics, iphub, ipqualityScore];

async function thirdPartyAnalysis(ip) {
  let data = await Promise.allSettled(supported.map((site) => site(ip)));
  let finalData = data.map((res, index) => {
    res.key = index;
    return res;
  });

  return finalData;
}

module.exports = thirdPartyAnalysis;
