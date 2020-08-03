const express = require("express");
const app = express();
const mongoose = require("mongoose");

const basicAuth = require("express-basic-auth");

mongoose.connect(
  "mongodb+srv://admin:anubhavsaha@proxyvpn.lhltg.gcp.mongodb.net/test",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("Sucessfully connected to the realtime database");
  }
);

const Report = require("./models/reports");

app.use(
  basicAuth({
    users: { admin: "infowise" },
    challenge: true,
  })
);

app.set("view engine", "ejs");

function get_color(score) {
  if (score < 40) {
    return "bg-success";
  } else if (score < 75) {
    return "bg-warning";
  } else {
    return "bg-danger";
  }
}

function generate_contact(params) {
  let content = ``;
  for (let item of params) {
    content += `<p>${item[0]} : ${item[1]} </p>`;
  }
  return content;
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

app.get("/report/:id", async (req, res) => {
  let id = req.params.id;
  if (id) {
    try {
      let report = await Report.findOne({ _id: id });
      report = JSON.parse(report.log);

      console.log(report);
      let color = get_color(report.value);
      let contact = generate_contact(report.contact);
      let AIReport = generate_block(report.table);

      report.color = color;
      report.AIReport = AIReport;
      report.contact = contact;
      res.render("report", report);
    } catch (e) {
      console.log(e);
      return res.json(e);
    }
  }
});

app.listen(80);
