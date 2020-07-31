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

      if (matchKeyword(reversedDNS, this.level1Keywords)) return 70;
      if (matchKeyword(reversedDNS, this.level2Keywords)) return 100;

      //match their webpage
      try {
        const resp = await rp(`http://${domain}`, {
          rejectUnauthorized: false,
          followAllRedirects: true,
        });

        //Keyword matching
        if (matchKeyword(resp, this.level2Keywords)) return 100;
        else if (matchKeyword(resp, this.level1Keywords)) return 70;
        //This is a clean page
        return 0;
      } catch (e) {
        // console.log(e);
        return 0;
      }
      //others
    } catch (e) {
      // console.log(e);
      return 20;
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
