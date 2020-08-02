import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";

import TitleBar from "./Components/TitleBar";
import ThirdParty from "./Components/ThirdParty";
import WHOIS from "./Components/WHOIS";

import IPDisplay from "./Components/IPDisplay.js";

import { Input, Typography, Tabs, Card } from "antd";
import { Button, Tooltip } from "antd";
import {
  ProfileOutlined,
  UploadOutlined,
  CheckOutlined,
  WarningOutlined,
  DotChartOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";

import { Statistic, Row, Col } from "antd";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;
const { Paragraph } = Typography;
const electron = window.require("electron");
const remote = electron.remote;
const dialog = remote.dialog;

const ipcRenderer = electron.ipcRenderer;

function Batch() {
  function callback(key) {
    console.log(key);
  }
  let [programState, updateProgramState] = useState("Idle");
  let [signatureMatched, updateSignatureMatched] = useState("");
  let [ip, updateIp] = useState("");
  let [score, updateScore] = useState(0);
  let [thirdPartData, updateThirdPartyData] = useState([]);
  let [whoisData, updateWhoISData] = useState([]);
  let [logs, updateLogs] = useState(["Sucessfully started program."]);

  useEffect(() => {
    ipcRenderer.on("thirdPartyData", (e, data) => {
      updateThirdPartyData(data);
      console.log(data);
    });

    ipcRenderer.on("whoisData", (e, result) => {
      // console.log(result);
      // alert("here");
      updateSignatureMatched(result.sig);
      updateWhoISData(result.table);
      updateScore(result.value);
      if (result.value > 65) {
        updateProgramState("Bad");
      } else {
        updateProgramState("Good");
      }
    });

    return function cleanUp() {
      ipcRenderer.removeAllListeners("thirdPartyData");
      ipcRenderer.removeAllListeners("whoisData");
    };
  }, []);

  return (
    <div>
      <div className="App">
        <div className="ipBox">
          <div>
            <Title level={3}>Batch Check</Title>
            <Button
              type="primary"
              onClick={async () => {
                console.log(
                  dialog.showOpenDialog({
                    properties: ["openFile"],
                  })
                );
              }}
            >
              <UploadOutlined />
            </Button>
            <Paragraph className="subtitle">
              Masscheck IPs from .txt or csv.
            </Paragraph>
          </div>
        </div>

        <div className="result">
          <Card bordered={true} style={{ width: "100%" }}>
            <div className="result">
              <Statistic
                title="Good"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckOutlined />}
                suffix="%"
              />
              <Statistic
                title="Bad"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<WarningOutlined />}
                suffix="%"
              />
              <Statistic
                title="Scanning"
                value={11.28}
                precision={2}
                prefix={<DotChartOutlined />}
                suffix="%"
              />
            </div>
          </Card>
        </div>
        <div className="toplog"></div>
        <div className="info">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Good" key="1">
              <IPDisplay />
            </TabPane>
            <TabPane tab="Bad" key="2">
              <IPDisplay />
            </TabPane>
            <TabPane tab="Processing" key="3">
              <IPDisplay />
            </TabPane>
          </Tabs>
        </div>
        {/* RESULT DISPLAY */}
      </div>
    </div>
  );
}

export default Batch;
