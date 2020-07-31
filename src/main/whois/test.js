const fs = require("fs");
const plimit = require("p-limit");
const ips = fs.readFileSync("./feed.txt", "utf-8").split("\r\n");
const pipelineRunner = require("./main");
const mongoose = require("mongoose");

const threads = 5;

const type = "PARALLEL";

if (type === "PARALLEL") {
  (async () => {
    //Move these to .env later
    await mongoose.connect(
      "mongodb+srv://admin:anubhavsaha@proxyvpn.lhltg.gcp.mongodb.net/test",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`Connected to the Realtime database`);
    const limit = plimit(threads);

    const input = ips.map((ip) => limit(() => pipelineRunner(ip)));
    await Promise.all(input);
  })();
} else {
  (async () => {
    await mongoose.connect(
      "mongodb+srv://admin:anubhavsaha@proxyvpn.lhltg.gcp.mongodb.net/test",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`Connected to the Realtime database`);
    for (ip of ips) {
      let k = await pipelineRunner(ip);
    }
  })();
}
