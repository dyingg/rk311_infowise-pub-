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

  let AI_results = await predictions(
    result.OrgInspectorBlacklist.result,
    result.BadASNInspector.result,
    result.TORInspector.result,
    result.IPblacklistInspector.result,
    result.ReverseDNSInspector.result,
    result.KeywordInspector.result
  );
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
  return {
    value: final,
    sig: result.VPNname.result,
    table: [
      {
        name: "OrgInspector",
        time: result.OrgInspectorBlacklist.time,
        score: result.OrgInspectorBlacklist.result,
      },
      {
        name: "BadASNInspector",
        time: result.BadASNInspector.time,
        score: result.BadASNInspector.result,
      },
      {
        name: "TOR Inspector",
        time: result.TORInspector.time,
        score: result.TORInspector.result,
      },
      {
        name: "IP BlacklistInspector",
        time: result.IPblacklistInspector.time,
        score: result.IPblacklistInspector.result,
      },
      {
        name: "ReverseDNSInspector",
        time: result.ReverseDNSInspector.time,
        score: result.ReverseDNSInspector.result,
      },
      {
        name: "KeywordInspector",
        time: result.KeywordInspector.time,
        score: result.KeywordInspector.result,
      },
    ],
  };
}

module.exports = runPipeline;
