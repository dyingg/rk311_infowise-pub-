/*
 * Filename: c:\Users\inktv\Desktop\SIH\whos-architecture\Inspectors\PipeLineInspector
 * Path: c:\Users\inktv\Desktop\SIH\whos-architecture
 * Created Date: Monday, July 20th 2020, 2:51:19 pm
 * Author: Dying
 *
 * Copyright (c) 2020
 *
 * Do not modify this file
 */
var fs = require("fs");

function matchKeyword(string, arr) {
  for (regex of arr) {
    if (regex.test(string)) return true;
  }
  return false;
}

class KeywordInspector {
  constructor() {
    //Load in your blacklists etc here for the piple line
    /*this.keyword1 = fs
      .readFileSync("./Blacklists/KeywordCategory1.txt", "utf8")
      .split(" ");
    this.keyword2 = fs
      .readFileSync("./Blacklists/KeywordCategory2.txt", "utf8")
      .split(" ");*/
      this.keyword1 = [
        /vpn/,
        /proxy/,
        /vps/,
        /virtual private network/,
        /virtual private server/,
        /express/,
        /nord/,
      ];
      this.keyword2 = [
        /hosts/,
        /cloud/,    //e.g. 35.186.177.35
        /hosting/,
        /ovh/,
        /aws/,
        /google llc/,
        /vultr/,
        /digitalocean/,
        /server/,
        /dedicated/,
      ];
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    //console.log(data);

    //Matching the Keywords in comments
    if (matchKeyword(data.name.toLowerCase(), this.keyword1)) return [100, "The organisation name for this particular IP suggests that it belongs to a Proxy/VPN service provider based on the keyword search algorithm used by the enforced inspector."];
    if (matchKeyword(data.name.toLowerCase(), this.keyword2)) return [70, "The organisation name for this particular IP suggests that it belongs to a Cloud/Hosting service provider based on the keyword search algorithm used by the enforced inspector."];
    if (matchKeyword(data.comments.join().toLowerCase(), this.keyword1)) return [100, "The WHOIS data for this IP suggests that it belongs to a Proxy/VPN service provider based on the keyword search algorithm used by the enforced inspector."];
    if (matchKeyword(data.comments.join().toLowerCase(), this.keyword2)) return [60, "The WHOIS data for this IP suggests that it belongs to a Cloud/Hosting service provider based on the keyword search algorithm used by the enforced inspector."];
    //No keywords matches
    return [0, "The WHOIS data and the organisation name for this IP is detected to contain no inferior keywords which might suggest it being a malacious IP. Hence, a NULL score is assigned to this IP by the enforced Inspector."];
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    
    return data;
  }
}

module.exports = KeywordInspector;
