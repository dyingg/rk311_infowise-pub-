"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const servers_1 = __importStar(require("./servers"));
async function sendRaw(server, ip) {
    return new Promise((resolve, reject) => {
        let response = "";
        const client = net_1.createConnection({
            host: server,
            port: 43,
        });
        client.on("connect", () => {
            if (server == servers_1.default.afrinic) {
                client.write(`n ${ip}\r\n`);
            }
            else {
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
            resolve(response);
        });
    });
}
async function WHOISRequest(server, ip) {
    let response = await sendRaw(server, ip);
    let result = {
        "FROM": [server]
    };
    let parsed = response.split("\n");
    parsed = parsed
        .map((k) => k.trim())
        .filter((k) => k.indexOf("#") && k.indexOf("%") && k != "");
    parsed.forEach((k) => {
        let params = k.split(":").map((k) => k.trim());
        if (params[0] !== "remarks") {
            if (result[params[0]]) {
                result[params[0]].push(params[1]);
            }
            else {
                result[params[0]] = [params[1]];
            }
        }
    });
    return result;
}
function generateResolver(ip) {
    return (server) => {
        return WHOISRequest(server, ip);
    };
}
async function getRelevantWHOIS(ip) {
    let serverResolver = generateResolver(ip);
    let WHOISServers = Object.values(servers_1.default);
    let results = await Promise.all(WHOISServers.map((srv) => serverResolver(srv)));
    return results;
}
async function getProjectWHOIS(ip) {
    let whois = await getRelevantWHOIS(ip);
    let speciality = await sendRaw(servers_1.speciality_1, ip);
    if (speciality.indexOf("Error") !== -1) {
        throw new Error("Error: finding ASN");
    }
    const asnFields = speciality
        .split("\n")[1]
        .split("|")
        .map((k) => k.trim());
    let relevant = { whois };
    relevant.asn = asnFields[0];
    relevant.asnName = asnFields[2];
    return relevant;
}
exports.default = getProjectWHOIS;
