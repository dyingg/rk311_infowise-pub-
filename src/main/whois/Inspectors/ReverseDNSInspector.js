/*
 * Filename: c:\Users\inktv\Desktop\SIH\whos-architecture\Inspectors\PipeLineInspector
 * Path: c:\Users\inktv\Desktop\SIH\whos-architecture
 * Created Date: Monday, July 20th 2020, 2:51:19 pm
 * Author: Dying
 *
 * Copyright (c) 2020
 *
 * Do not modify this file
 *
 *
 *
 * TO INSTALL BEFORE RUNNING
 * npm i -s request-promise
 * npm i -s request
 */

const dns = require("dns");
const promisify = require("util").promisify;
const reverse = promisify(dns.reverse);
const rp = require("request-promise");

function matchKeyword(string, arr) {
  for (regex of arr) {
    if (regex.test(string)) return true;
  }
  return false;
}

class ReverseDNSInspector {
  constructor() {
    //Load in your blacklists etc here for the piple line
    this.level1Keywords = [
      /server/,
      /hosting/,
      /cloud/,
      /compute/,
      /aws/,
      /amazon/,
      /vultr/,
      /ovh/,
    ];
    this.level2Keywords = [
      /proxy/,
      /vpn/,
      /vps/,
      /virtual private network/,
      /virtual private server/, //e.g. 142.44.240.127, 198.50.215.176
    ];
  }

  async inspectionTechnique(ip) {
    try {
      let reversedDNS = await reverse(ip);

      let queryOn = reversedDNS[0];
      let params = queryOn.split(".");
      let url = params.slice(params.length - 2);
      let domain = url.join(".");

      //Pre query match

      if (matchKeyword(reversedDNS, this.level1Keywords)) return [70, String("The domain : " + reversedDNS + " obtained from the inspection was detected to be a part of Cloud/Hosting service based on the algorithm used by the inspector. Hence, a 70 out of 100 score is devoted to this IP by the enforced module.")];
      if (matchKeyword(reversedDNS, this.level2Keywords)) return [100, String("The domain : " + reversedDNS + " obtained from the inspection was detected to be a part of Proxy/VPN service based on the algorithm used by the inspector. Hence, a score of 100 is devoted to this IP by the enforced module.")];

      //match their webpage
      try {
        const resp = await rp(`http://${domain}`, {
          rejectUnauthorized: false,
          followAllRedirects: true,
        });

        //Keyword matching
        if (matchKeyword(resp, this.level2Keywords)) return [100, String("The Contents of the website for this domain : " + reversedDNS + " obtained from the inspection was detected to be a part of Proxy/VPN service based on the algorithm used by the inspector. Hence, a score of 100 is devoted to this IP by the enforced module.")];
        else if (matchKeyword(resp, this.level1Keywords)) return [70, String("The Contents of the website for this domain : " + reversedDNS + " obtained from the inspection was detected to be a part of Hosting/Cloud service based on the algorithm used by the inspector. Hence, a 70 out of 100 score is devoted to this IP by the enforced module.")];
        //This is a clean page
        return [0, "The domain and the contents of the website obtained from the insvestigation seems to be secure based on the inspector's search algorithm. Hence a NULL score is devoted to this IP by the enforced inspector."];
      } catch (e) {
        // console.log(e);
        return [0, "The domain and the contents of the website obtained from the insvestigation seems to be secure based on the inspector's search algorithm. Hence a NULL score is devoted to this IP by the enforced inspector."];
      }
      //others
    } catch (e) {
      // console.log(e);
      return [20, "The domain was unreachable by the inspectors search algorithm. Hence a 20 out of 100 score is devoted to this IP as it has an unknown reputation according to the enforced module."];
    }
  }

  /**
   * Expects query IP to be there in the WHOIS reponse.
   */
  async transformer(data) {
    return data.ip;
  }
}

module.exports = ReverseDNSInspector;
