const ip_whois = require("./core.js");


function get_ip_score(ip) {
    let url = "https://ipqualityscore.com/api/json/ip/8cGC1nCMsxxrKw1HmlMYB8TdKdmYZ2FF/" + ip;
    
}


async function create_dataset() {
    var data = await ip_whois.whoisscorer("139.99.122.74");
    console.log(data);

    
}