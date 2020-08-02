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

const spawn = require("child_process").spawn;
const blacklists = require("./../models/blacklist");
const path = require("path");

class IPblacklistInspector {
  constructor() {
    //Load in your blacklists etc here for the piple line
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(ip) {
    let result = "";
    let blackListCount = await blacklists.countDocuments({ ip: ip });
    // console.log(blackListCount);
    let pythonProcess = spawn("python", [
      path.resolve(__dirname, "matchBlacklists.py"),
      ip,
      blackListCount,
    ]);
    for await (const data of pythonProcess.stdout) {
      result = String(data).trim();
      // console.log(result);
    }
    // console.log(__dirname);
    return [parseInt(result), String("The IP : " + ip +" has been found " + parseInt(result) +" times in the blacklist accumulated by Info-wise.")];
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    return data.ip;
  }
}

module.exports = IPblacklistInspector;
