async function getResult(ip) {
  //Do your processing

  //let score = someModuleYouImport.isProxy(ip);

  return {
    name: "Name you want shown",
    type: "IP/VPN or Black List",
    status: "Info that user can make sense out of",
    score: 0, //[0-100] 0 is very good,100 is very bad
  };
}

module.exports = getResult;
