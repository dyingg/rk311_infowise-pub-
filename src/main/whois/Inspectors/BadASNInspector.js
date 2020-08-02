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
const fs = require("fs");
const os = require("os");
const path = require("path");

class BadASNInspector {
  constructor() {
    //Load in your blacklists etc here for the piple line
    this.asn_data = fs
      .readFileSync(
        path.resolve(__dirname, "../", "Blacklists", "new_asn_blacklist.txt"),
        "utf8"
      )
      .split(os.EOL);

    this.asn_map = {};

    this.asn_data.forEach((asn) => {
      let params = asn.split(" ");
      this.asn_map[params[0]] = parseFloat(params[2]);
    });
  }
  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    //console.log(data);
    // return this.asn_map[data] || 0;

    let score = this.asn_map[data];
    if (score > 0 && score <= 20) {
      return [
        score,
        String(
          "The ASN : " +
            data +
            " obtained from an internal database/WHOIS data is deemed to be secure and unsuspicious based on the internal spam ratings used by the inspector. This ASN seems to be secure and the IP should have a normal connection. Hence a score of : " +
            score +
            " is assigned to this IP by the enforced inspector."
        ),
      ];
    } else if (score > 20 && score < 60) {
      return [
        score,
        String(
          "The ASN : " +
            data +
            " obtained from an internal database/WHOIS data appears to be suspicious and unreliable based on the internal spam ratings used by the inspector. This ASN may belong to a large hosting company or a malicious ISP. Hence a score of : " +
            score +
            " is assigned to this IP by the enforced inspector."
        ),
      ];
    } else if (score >= 60 && score <= 100) {
      return [
        score,
        String(
          "The ASN : " +
            data +
            " obtained from an internal database/WHOIS data appears to belong to a Proxy/VPN service provider based on the internal spam ratings used by the inspector. Hence a score of : " +
            score +
            " is assigned to this IP by the enforced inspector."
        ),
      ];
    } else {
      return [0, "Nothing detected."];
    }
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    let asnKey = data.asn != null ? String(data.asn) : String(data.origin);
    return asnKey;
  }
}

module.exports = BadASNInspector;
