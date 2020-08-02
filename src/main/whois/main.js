const PipeLine = require("./Pipleline");
const Inspector = require("./Inspectors/OrgInspectorWhitelist");
const OrgInspectorWhitelist = require("./Inspectors/OrgInspectorWhitelist");
const OrgInspectorBlacklist = require("./Inspectors/OrgInspectorBlacklist");
const InspectorPipeLine = require("./Pipleline");
const KeywordInspector = require("./Inspectors/KeywordInspector");
const GoodASNInspector = require("./Inspectors/GoodASNInspector");
const BadASNInspector = require("./Inspectors/BadASNInspector");
const processWhoisData = require("./processWhoisData");
const ReverseDNSInspector = require("./Inspectors/ReverseDNSInspector");
const IPblacklistInspector = require("./Inspectors/IPblacklistInspector");
const TORInspector = require("./Inspectors/TORInspector");
const fs = require("fs");
const VPNname = require("./Inspectors/VPNname");
const AI = require("./AI module/AIPredictions");
const predictions = require("./AI module/AIPredictions");
const rp = require("request-promise");

async function runPipeline(ip) {
  const WhoisInspector = new InspectorPipeLine();

  let data = await processWhoisData(ip);
  if (!data) {
    console.log("Whois data failed");
    return;
  }
  data.ip = ip;
  // console.log(data);

  let result = await WhoisInspector.input(data)
    .addInspector(new ReverseDNSInspector())
    .addInspector(new OrgInspectorWhitelist())
    .addInspector(new KeywordInspector())
    .addInspector(new BadASNInspector())
    .addInspector(new OrgInspectorBlacklist())
    .addInspector(new GoodASNInspector())
    .addInspector(new IPblacklistInspector())
    .addInspector(new TORInspector())
    .addInspector(new VPNname())

    .run();

  let AI_results = await rp("http://35.184.88.73/", {
    method: "POST",
    url: "http://35.184.88.73/",
    headers: {
      "Content-Type": "application/json",
    },
    json: {
      data: [
        result.OrgInspectorBlacklist.result[0],
        result.BadASNInspector.result[0],
        result.TORInspector.result[0],
        result.IPblacklistInspector.result[0],
        result.ReverseDNSInspector.result[0],
        result.KeywordInspector.result[0],
      ],
    },
  });

  AI_results = AI_results.response;

  let final = (AI_results.reduce((accum, cur) => accum + cur) / 3) * 100;

  console.log("IP : " + ip);
  console.log("Inspector results : ");
  console.log(result);
  console.log("\nAI results : " + AI_results);

  if (result.OrgInspectorWhitelist.result == 1) {
    final *= 0.9;
  }
  if (result.GoodASNInspector.result == 1) {
    final *= 0.9;
  }

  console.log("\nThe final result is  : " + final);

  // console.log("\nAverage Score = " + (parseInt(result.BadASNInspector.result) + parseInt(result.GoodASNInspector.result) + parseInt(result.ReverseDNSInspector.result) + parseInt(result.KeywordInspector.result) + parseInt(result.OrgInspectorBlacklist.result) + parseInt(result.OrgInspectorWhitelist.result)) / 4);

  // if(result.KeywordInspector.result != 0) {
  // console.log(ip);
  // console.log(result);

  // console.log("\nAverage Score = " + (parseInt(result.BadASNInspector.result) + parseInt(result.GoodASNInspector.result) + parseInt(result.ReverseDNSInspector.result) + parseInt(result.KeywordInspector.result) + parseInt(result.OrgInspectorBlacklist.result) + parseInt(result.OrgInspectorWhitelist.result)) / 4);

  // fs.appendFileSync("RESULTS.txt", '\n' + ip + '\n', "utf8");
  // fs.appendFileSync("RESULTS.txt", JSON.stringify(result) + '\n', "utf8");
  // fs.appendFileSync("RESULTS.txt", "\nAverage Score = " + (parseInt(result.BadASNInspector.result) + parseInt(result.GoodASNInspector.result) + parseInt(result.ReverseDNSInspector.result) + parseInt(result.KeywordInspector.result) + parseInt(result.OrgInspectorBlacklist.result) + parseInt(result.OrgInspectorWhitelist.result)) / 4 + '\n', "utf8");

  // }
  //Leave this return here to make testing work
  console.log(result);
  let analysis = "";

  if (final >= 0 && final < 45) {
    analysis = String(
      "Low risk: The IP : " +
        data.ip +
        " has a low score according to our algorithms and databases as well as the various inspectors implemented. It has no abuse issues  reported against it nor is it associated with any malicious activity. It is not present in any spam list or blacklists. This IP does not have any connection to proxy/VPN servers. and hence it is considered as low risk by the scoring algorithm deployed by Infowise."
    );
  } else if (final >= 45 && final < 65) {
    analysis = String(
      "Suspicious: The IP : " +
        data.ip +
        " has a score somewhere in the midpoint according to our algorithms and databases as well as the various inspectors implemented.  This IP address is exhibiting questionable and suspicious behavior. It may be associated with any malicious activity. This IP may be  connected to low-risk proxy/VPN servers. and hence it is considered suspicious and unreliable by the scoring algorithm deployed by Infowise."
    );
  } else {
    analysis = String(
      "High risk: The IP : " +
        data.ip +
        " has a score in the higher ranges according to our algorithms and databases as well as the various inspectors implemented.  This IP address is exhibiting questionable, fraudulent  behavior. It is likely that this IP is associated with malicious activity. This IP is deemed to belong to proxy/VPN servers. and hence it is considered unreliable by the scoring algorithm deployed by Infowise."
    );
  }
  console.log("\n" + analysis);
  console.log("\nAbuse Mail : ");
  console.log(data.abuseMail);
  console.log("\nAbuse Phone : " + data.abusePhone);
  console.log("\nOrganisation Tech. Phone : " + data.orgTechPhone);
  console.log("\nPhone : " + data.phone);

  return {
    value: parseInt(final),
    sig: result.VPNname.result,
    analysis,
    contact: [
      ["Abuse Mail", data.abuseMail],
      ["Abuse Phone", data.abusePhone],
      ["Organisation Tech. Phone", data.orgTechPhone],
      ["Phone", data.phone],
    ],
    table: [
      {
        name: "OrgInspector",
        time: result.OrgInspectorBlacklist.time,
        score: result.OrgInspectorBlacklist.result[0],
        remarks: result.OrgInspectorBlacklist.result[1],
      },
      {
        name: "BadASNInspector",
        time: result.BadASNInspector.time,
        score: result.BadASNInspector.result[0],
        remarks: result.BadASNInspector.result[1],
      },
      {
        name: "TOR Inspector",
        time: result.TORInspector.time,
        score: result.TORInspector.result[0],
        remarks: result.TORInspector.result[1],
      },
      {
        name: "IP BlacklistInspector",
        time: result.IPblacklistInspector.time,
        score: result.IPblacklistInspector.result[0],
        remarks: result.IPblacklistInspector.result[1],
      },
      {
        name: "ReverseDNSInspector",
        time: result.ReverseDNSInspector.time,
        score: result.ReverseDNSInspector.result[0],
        remarks: result.ReverseDNSInspector.result[1],
      },
      {
        name: "KeywordInspector",
        time: result.KeywordInspector.time,
        score: result.KeywordInspector.result[0],
        remarks: result.KeywordInspector.result[1],
      },
    ],
  };
}

module.exports = runPipeline;
