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

class TORInspector {
  constructor() {
    //Load in your blacklists etc here for the piple line
    this.tor_data = fs
      .readFileSync(
        path.resolve(__dirname, "../", "Blacklists", "TORexits.txt"),
        "utf8"
      )
      .split(os.EOL);

    this.tor_map = {};

    this.tor_data.forEach((tor) => {
      this.tor_map[tor] = true;
    });
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    if (data in this.tor_map) {
      return 1;
    }

    //Not a TOR exit node
    return 0;
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    return data.ip;
  }
}

module.exports = TORInspector;
