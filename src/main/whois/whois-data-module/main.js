const PipeLine = require("./Pipleline");
const Inspector = require("./Inspectors/PipeLineInspector");
const PipeLineInspector = require("./Inspectors/PipeLineInspector");
const InspectorPipeLine = require("./Pipleline");
const NetNameInspector = require("./Inspectors/NetNameInspector");

const WhoisInspector = new InspectorPipeLine();

(async () => {
  let result = await WhoisInspector.input({ netname: "ANUBHAV COMPANY" })
    .addInspector(new PipeLineInspector())
    .addInspector(new NetNameInspector())
    .run();
  console.log(result);
})();
