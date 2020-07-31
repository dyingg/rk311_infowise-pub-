const spawn = require("child_process").spawn;

function predictions(
  org_score,
  asn_score,
  tor_score,
  blacklist_score,
  rDNSscore,
  keyword_score
) {
  return new Promise((resolve, reject) => {
    let pythonProcess = spawn(
      __dirname + "\\getPrediction.exe",
      [
        org_score,
        asn_score,
        tor_score,
        blacklist_score,
        rDNSscore,
        keyword_score,
      ],
      { cwd: `${__dirname}` }
    );

    console.log([
      org_score,
      asn_score,
      tor_score,
      blacklist_score,
      rDNSscore,
      keyword_score,
    ]);

    var parsed_results = [];

    // pythonProcess.on("message", console.log);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      console.log(String(data));
      let results = String(data).trim().split(" ");
      // console.log(results)
      results.forEach((element) => {
        let parse_value = parseFloat(element);
        if (isNaN(parse_value)) {
          throw new Error(data);
        }
        parsed_results.push(parse_value);
      });
      resolve(parsed_results);
    });
  });

  // pythonProcess.stderr.on("data", console.log);

  // pythonProcess.stdout.on("data", console.log);

  // for await (let data of pythonProcess.stdout) {

  // }
  // // console.log(parsed_results)\
  // console.log(parsed_results);
  // return parsed_results;
}

// predictions(3000, 23, 66, 0, 0)

module.exports = predictions;
