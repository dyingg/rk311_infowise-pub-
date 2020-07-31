const lookUp = require("./dist/main").default;

async function whoisScorer(ip) {
  let whoisData = await lookUp(ip);

  console.log(JSON.stringify(whoisData));

  //Consolelog the value instead of returning for now
}

whoisScorer("195.206.104.106");
