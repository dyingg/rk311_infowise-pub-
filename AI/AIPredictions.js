const spawn = require("child_process").spawn
const execFile = require('child_process').execFile;




async function predictions(org_score, asn_score, tor_score, blacklist_score, rDNSscore, keyword_score) {
    
    let pythonProcess = spawn(__dirname + '/getPrediction.exe', [org_score, asn_score, tor_score, blacklist_score, rDNSscore, keyword_score]);
    var parsed_results = [];

    for await (let data of pythonProcess.stdout) {
        // let results = String(data).trim().split(' ');
        console.log(data)
        // results.forEach(element => {
        //     let parse_value = parseFloat(element);
        //     if(isNaN(parse_value)) {
        //         throw new Error(data);
        //     }
        //     parsed_results.push(parse_value);
        // });
    }
    // console.log(parsed_results)

    // const child = execFile('getPrediction.exe', [org_score, asn_score, tor_score, blacklist_score, rDNSscore, keyword_score], (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log(stdout);
    // });
    return parsed_results;
}

predictions(23, 66, 0, 0, 20, 60)



module.exports = predictions