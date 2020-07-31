var fs = require("fs");

function matchKeyword(string, arr) {
  for (regex of arr) {
    if (regex.test(string)) return true;
  }
  return false;
}

class VPNname {
  constructor() {
    //Load in your blacklists etc here for the piple line
      this.keyword = [
        "express",
        "nordvpn",//eg. 185.203.122.22
        "nord",
      ];
      this.keyword_map = {
        "express" : "Express VPN",
        "nordvpn" : "Nord VPN",
        "nord" : "Nord VPN",
      };
  }

  /**
   * Inspection procedure f
   * @param {*} data transformed data
   */
  async inspectionTechnique(data) {
    //console.log(data);

    //Matching the Keywords in comments
    for(i in this.keyword) {
        if(String(data.all).toLowerCase().includes(this.keyword[i])) return this.keyword_map[this.keyword[i]];
    }
    //No keywords matches
    return String(data.name + " (No signature found !)");
  }

  /**
   * Transformer
   * @param {*} data
   */
  async transformer(data) {
    
    return data;
  }
}

module.exports = VPNname;