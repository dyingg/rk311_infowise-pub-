import { createConnection } from "net";
import servers, { speciality_1 } from "./servers";

async function sendRaw(server: string, ip: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let response = "";
    const client = createConnection({
      host: server,
      port: 43,
    });

    client.on("connect", () => {
      if (server == servers.afrinic) {
        client.write(`n ${ip}\r\n`);
      } else {
        client.write(`${ip}\r\n`);
      }
    });

    client.on("data", (data) => {
      response += data;
    });

    client.on("error", (err) => {
      reject(err);
    });

    client.on("close", (had_error) => {
      if (had_error) {
        reject({ err: "Err" });
      }

      //   console.log(`looking up ${server}`);
      //   console.log(response);

      resolve(response);
    });
  });
}

async function WHOISRequest(
  server: string,
  ip: string
): Promise<{ [key: string]: String[] }> {
  let response = await sendRaw(server, ip);
  let result: { [key: string]: String[] } = {
    "FROM" : [server]
  };
  let parsed = response.split("\n");
  parsed = parsed
    .map((k) => k.trim())
    .filter((k) => k.indexOf("#") && k.indexOf("%") && k != "");

  parsed.forEach((k) => {
    //Pretify
    let params = k.split(":").map((k) => k.trim());

    if (params[0] !== "remarks") {
      if (result[params[0]]) {
        result[params[0]].push(params[1]);
      } else {
        result[params[0]] = [params[1]];
      }
    }
  });

  return result;
}

function generateResolver(
  ip: string
): (arg0: string) => Promise<{ [key: string]: String[] | String }> {
  return (server: string) => {
    return WHOISRequest(server, ip);
  };
}

async function getRelevantWHOIS(
  ip: string
): Promise<{ [key: string]: String[] | String }[]> {
  let serverResolver = generateResolver(ip);
  let WHOISServers = Object.values(servers);
  let results = await Promise.all(WHOISServers.map((srv) => serverResolver(srv)));
  return results;
}

async function getProjectWHOIS(
  ip: string
): Promise<any> {
  let whois = await getRelevantWHOIS(ip);
  let speciality = await sendRaw(speciality_1, ip);

  if (speciality.indexOf("Error") !== -1) {
    throw new Error("Error: finding ASN");
  }

  const asnFields = speciality
    .split("\n")[1]
    .split("|")
    .map((k) => k.trim());

  let relevant:any = {whois};
  relevant.asn = asnFields[0];
  relevant.asnName = asnFields[2];

  return relevant;
}

export default getProjectWHOIS;
