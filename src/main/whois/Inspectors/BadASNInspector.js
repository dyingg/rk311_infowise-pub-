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
    return this.asn_map[data] || 0;
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
