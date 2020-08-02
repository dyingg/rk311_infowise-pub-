/**
 * Generate HTML response for INFOWISE PROXY VPN SCANNER
 */
const ejs = require("ejs");
const fs = require("fs");

const templateRaw = fs.readFileSync("./index.ejs", "utf-8");
const report = JSON.parse(fs.readFileSync("./59.65.157.100.json"));

var pdf = require("html-pdf");
const { config } = require("process");
var options = { format: "Letter" };

function get_color(score) {
  if (score < 40) {
    return "bg-success";
  } else if (score < 75) {
    return "bg-warning";
  } else {
    return "bg-danger";
  }
}

function generate_block(params) {
  let content = ``;
  for (let item of params) {
    content += `  
      <div style="padding: 10px;">
          <b><i>${item.name}</i><br></b> <br/>
          <b>${item.score}%</b>
          
          <div class="progress">
              <div class="progress-bar ${get_color(
                item.score
              )}" role="progressbar" style="width: ${parseInt(
      item.score
    )}%" aria-valuenow="${parseInt(
      item.score
    )}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br />
          <p style="font-size: 14px;">${item.remarks}</p>   
      </div>
      `;
  }
  return content;
}

function renderLog(data) {
  let color = get_color(report.value);
  let AIReport = generate_block(report.table);
  report.color = color;
  report.AIReport = AIReport;
  let content = ejs.render(templateRaw, report, {
    delimiter: "%",
    openDelimiter: "<",
    closeDelimiter: ">",
  });
  fs.writeFileSync(`./${report.ip}.html`, content);
  pdf.create(content, options).toFile(`./${report.ip}.pdf`, (f, err) => {});
}

renderLog();
