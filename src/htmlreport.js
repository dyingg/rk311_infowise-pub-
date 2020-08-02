/**
 * Generate HTML response for INFOWISE PROXY VPN SCANNER
 */
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const templateRaw = fs.readFileSync(
  path.resolve(__dirname, "./index.ejs"),
  "utf-8"
);

var pdf = require("html-pdf");
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

function renderLog(report) {
  let color = get_color(report.value);

  let AIReport = generate_block(report.table);
  report.color = color;
  report.AIReport = AIReport;
  let content = ejs.render(templateRaw, report, {
    delimiter: "%",
    openDelimiter: "<",
    closeDelimiter: ">",
  });
  fs.writeFileSync(
    path.resolve(__dirname, "..", "reports", `./${report.ip}.html`),
    content
  );
  pdf
    .create(content, options)
    .toFile(
      path.resolve(__dirname, "..", "reports", `./${ip}.pdf`),
      (f, err) => {}
    );
}

module.exports = renderLog;
