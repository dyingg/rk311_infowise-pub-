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
const os = require("os");
const path = require("path");

function matchKeyword(string, arr) {
  for (regex of arr) {
    if (regex.test(string)) return true;
  }
  return false;
}

class OrgInspectorBlacklist {
  constructor() {
    //Load in your blacklists etc here for the piple line

    this.orgBlacklist = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../",
          "Blacklists",
          "OrganizationBlacklist.txt"
        ),
        "utf8"
      )
      .toLowerCase()
      .split(os.EOL);

    this.org_map = {};

    this.orgBlacklist.forEach((org) => {
      let params = org.split("    ");
      this.org_map[params[0]] = parseFloat(params[1]);
    });
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    // console.log(data);
    //Matching the organisation with our blacklisted database
    return this.org_map[data] || 0;
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    return String(data.name).toLowerCase();
  }
}

module.exports = OrgInspectorBlacklist;
