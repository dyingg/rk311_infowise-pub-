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
const path = require("path");

class OrgInspectorWhitelist {
  constructor() {
    //Load in your blacklists etc here for the piple line
    this.orgWhitelist = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../",
          "Blacklists",
          "OrganizationWhitelist.txt"
        ),
        "utf8"
      )
      .toLowerCase();
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    //console.log(data);
    if (this.orgWhitelist.includes(String(data).toLowerCase())) {
      return 1;
    }
    return 0;
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    return data.name;
  }
}

module.exports = OrgInspectorWhitelist;
