const lookUp = require("./whois-data-module/dist/main").default;
const IPinfo = require("node-ipinfo");
const spawn = require("child_process").spawn;

// const orgNameParameters = ["OrgName", "org-name", "mnt-by", "origin", "asnName"];
const asnNameParameters = ["origin", "asn"];
const commentsParameters = ["remarks", "comment", "netname", "e-mail", "OrgAbuseHandle", "OrgNOCHandle", "OrgAbuseEmail", "desscr", "RTechEmail", "OrgTechEmail"];
const abuseMailParameters = ["OrgAbuseEmail"] 
const token = "6014cc7d7ff86e"
const ipinfo = new IPinfo(token);

const path = require('path');

async function processData(ip) {
    try {
        let whoisData = await lookUp(ip);
        // console.log(JSON.stringify(whoisData));
        

        whoisData = whoisData.whois;
        var asnList = [];
        let commentsList = [];
        let asn = "", hostName = "", allData = "";
        let abuseMail = {}
        
        let temp = await getHostNameAndASN(ip);
        asn = temp[0], hostName = temp[1];
        

        for(i in whoisData) {
            
            let whoisKeys = {};
            Object.keys(whoisData[i]).forEach(element=> {
                whoisKeys[element.toLowerCase()] = element;
                allData += whoisData[i][element];
            });
            // console.log(whoisKeys)

            asnList = asnList.concat(getASN(whoisData[i], whoisKeys));
            commentsList = commentsList.concat(getComments(whoisData[i], whoisKeys));
            abuseMail = getAbusemail(whoisData[i], abuseMail);

        }

        
        if(asn == "") {
            if(asnList.length == 0)
                asn = parseASN(await getAsnFromThirdParty(ip));
            else
                asn = asnList[0];
        }

        if(hostName == "")
            hostName = await getHostName(ip, "AS" + asn);

        parsedData = {
            "asn": asn,
            "comments": commentsList,
            "name": hostName,
            "abuseMail": abuseMail,
            "all": allData
        };

        // console.log(parsedData);

        return parsedData;
    }
    catch {
        return null;
    }
}

function parseASN(asn) {
    if(asn.length > 0 && (asn.startsWith("AS") || asn.startsWith("as")))
        return asn.substring(2);

    return asn
}

function parseKeys(dict, key) {
    if(key.toLowerCase() in dict)
        return dict[key];
    return null;
}


function getASN(whoisData, whoisKeys) {

    let asnList = [], asn = "", asnParam = "";

    for(j in asnNameParameters) {
        asnParam = parseKeys(whoisKeys, asnNameParameters[j]);
        if(asnParam) {
            asn = parseASN(whoisData[asnParam][0]); 
            asnList.push(asn);
        }
    }

    return asnList;
}


function getComments(whoisData, whoisKeys) {

    let commentsList = [], commentsParam = "";

    for(j in commentsParameters) {
        commentsParam = parseKeys(whoisKeys, commentsParameters[j]);
        if(commentsParam) {
            whoisData[commentsParam].forEach(comment => {
                commentsList.push(comment);
            });
        }
    }
    return commentsList;
}

function getAbusemail(whoisData, abuseMail) {
    
    for(j in abuseMailParameters) {
        if(abuseMailParameters[j] in whoisData) {
            whoisData[abuseMailParameters[j]].forEach(abuseData => {
                abuseMail[abuseData] = true;
            });
        }
    }

    return abuseMail;
}


async function getHostName(ip, asn) {

    let hostName = "";
    let response = "";

    try{
        response = await ipinfo.lookupIp(ip);
        hostName = response.asn.name;
    }
    catch(error) {}

    if(hostName == ""){
        try {
            response = await ipinfo.lookupASN(asn);
            hostName = response.name;
        }
        catch(error) {}
    }
    
    // console.log(hostName)
    return hostName;
}


async function getHostNameAndASN(ip) {
    let asn = "", hostName = "";
   
    let pythonProcess = spawn('python',[path.resolve(__dirname, "getHostName.py"), ip]);
    
    for await (let data of pythonProcess.stdout) {
        data = data.toString().trim();
        if (data != "-1"){
            l = data.split(' ');
            asn = l[0];
            for (i in l) {
                if (i >= 1)
                    hostName += l[i] + ' ';
            }
            hostName = hostName.trim();
        }
        // console.log([asn, hostName])
    };

    // console.log([asn, hostName])
    return [asn, hostName];

}


async function getAsnFromThirdParty(ip) {
    let asn = "";
    try{
        let response = await ipinfo.lookupIp(ip);
        asn = response.asn.asn;
    }
    catch(error) {}
    
    // console.log(asn);
    return asn;
}

// getHostName("7.121.188.10", "");
// processData("164.132.92.180");

// getHostNameAndASN("138.68.184.50");

module.exports = processData;