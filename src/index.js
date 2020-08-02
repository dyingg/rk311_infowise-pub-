const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const thirdPartyAnalysis = require("./main/thirdparty/index");
const WHOISModule = require("./main/whois/main");
const reportgen = require("./htmlreport");

const Report = require("./reports.js");

const Store = require("electron-store");

const store = new Store({
  defaults: {
    settings: {
      offline: false,
      databaseSaved: false,
    },
  },
});

const { time } = require("console");

const reportServer = `localhost`;

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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let batchData = {};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // mainWindow.loadURL(`file://${__dirname}/frontend/index.html`);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("thirdPartyRecon", async (event, ip) => {
  let data = await thirdPartyAnalysis(ip);
  data = data
    .filter((res) => res.status === "fulfilled" && res.value)
    .map((res) => res.value);
  console.log(data);
  event.sender.send("thirdPartyData", data);
});

ipcMain.on("startWhoisModule", async (event, ip) => {
  let result = await WHOISModule(ip);

  event.sender.send("whoisData", result);
});

ipcMain.on("batchProcess", async (event, file) => {
  let fileSelection = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  console.log();

  let batchFile = fileSelection.filePaths[0];

  let ipFile = fs.readFileSync(batchFile, "utf-8");

  let ips = ipFile.split("\r\n");

  ips.forEach((ip) => {
    batchData[ip] = {
      status: 0,
      ip,
    };
  });
  //Update UI

  event.sender.send("updateBatchState", batchData);
  ips.forEach(async (ip) => {
    let result = await WHOISModule(ip);
    const timestamp = String(new Date());
    let logToSave = result;
    logToSave.timestamp = timestamp;
    logToSave.ip = ip;
    let logJson = JSON.stringify(logToSave);

    let ipReport = new Report({
      ip,
      log: logJson,
      timestamp,
    });

    let savedIPReport = await ipReport.save();

    result.reportId = savedIPReport._id.toString();

    if (result) {
      if (result.value > 50) {
        batchData[ip] = {
          status: 2,
          ip,
          reportId: savedIPReport._id.toString(),
          fullResult: result,
          result: result.value,
        };
      } else {
        batchData[ip] = {
          status: 1,
          ip,
          reportId: savedIPReport._id.toString(),
          fullResult: result,
          result: result.value,
        };
      }
    }

    event.sender.send("updateBatchState", batchData);
  });
});

ipcMain.on("getRecent", async (e) => {
  let res = await Report.find({}, "_id ip timestamp", {
    sort: { created_at: -1 },
  })
    .limit(10)
    .lean();

  e.sender.send("updateRecent", res);
});
/**
 * Rendering the report for users
 */

ipcMain.on("render-report", (e, id) => {
  // const timestamp = String(new Date());
  // let result = batchData[ip].fullResult;
  // result.timestamp = timestamp;
  // result.ip = ip;
  // let json = JSON.stringify(result);
  // fs.writeFile(
  //   path.resolve(__dirname, "..", "reports", `./${ip}.json`),
  //   json,
  //   () => {}
  // );
  // reportgen(result);
  console.log(id);
  require("electron").shell.openExternal(`http://${reportServer}/report/${id}`);
});

/***
 * Offline handling
 */

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
