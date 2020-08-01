import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";

import Single from "./Single";

import TitleBar from "./Components/TitleBar";
import ThirdParty from "./Components/ThirdParty";
import WHOIS from "./Components/WHOIS";
import { Input, Typography, Tabs, Card } from "antd";
import { Button, Tooltip } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { Progress } from "antd";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;
const { Paragraph } = Typography;
const electron = window.require("electron");
const remote = electron.remote;
const dialog = remote.dialog;

const ipcRenderer = electron.ipcRenderer;

function App() {
  // let [programState, updateProgramState] = useState("Idle");
  // let [signatureMatched, updateSignatureMatched] = useState("");
  // let [ip, updateIp] = useState("");
  // let [score, updateScore] = useState(0);
  // let [thirdPartData, updateThirdPartyData] = useState([]);
  // let [whoisData, updateWhoISData] = useState([]);
  // let [logs, updateLogs] = useState(["Sucessfully started program."]);

  // useEffect(() => {
  //   ipcRenderer.on("thirdPartyData", (e, data) => {
  //     updateThirdPartyData(data);
  //     console.log(data);
  //   });

  //   ipcRenderer.on("whoisData", (e, result) => {
  //     // console.log(result);
  //     // alert("here");
  //     updateSignatureMatched(result.sig);
  //     updateWhoISData(result.table);
  //     updateScore(result.value);
  //     if (result.value > 65) {
  //       updateProgramState("Bad");
  //     } else {
  //       updateProgramState("Good");
  //     }
  //   });
  // }, []);

  return (
    <div>
      <TitleBar />
      <div></div>
      <Single />
    </div>
  );
}

export default App;
