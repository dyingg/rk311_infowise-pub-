import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";

import TitleBar from "./Components/TitleBar";
import ThirdParty from "./Components/ThirdParty";
import WHOIS from "./Components/WHOIS";

import IPDisplay from "./Components/IPDisplay.js";
import Processing from "./Components/Processing.js";

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

  let [good, updateGood] = useState([]);
  let [bad, updateBad] = useState([]);
  let [processing, updateProcessing] = useState([]);

  useEffect(() => {
    // ipcRenderer.on("thirdPartyData", (e, data) => {
    //   updateThirdPartyData(data);
    //   console.log(data);
    // });

    ipcRenderer.on("updateBatchState", (e, state) => {
      let good = [];
      let bad = [];
      let processing = [];

      Object.keys(state).forEach((ip) => {
        if (state[ip].status == 2) {
          bad.push(state[ip]);
        } else if (state[ip].status == 1) {
          good.push(state[ip]);
        } else {
          processing.push(state[ip]);
        }
      });

      updateGood(good);
      updateBad(bad);
      updateProcessing(processing);

      console.log(state);
    });
    // ipcRenderer.on("whoisData", (e, result) => {
    //   // console.log(result);
    //   // alert("here");
    //   updateSignatureMatched(result.sig);
    //   updateWhoISData(result.table);
    //   updateScore(result.value);
    //   if (result.value > 65) {
    //     updateProgramState("Bad");
    //   } else {
    //     updateProgramState("Good");
    //   }
    // });

    return function cleanUp() {
      ipcRenderer.removeAllListeners("updateBatchState");
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
              onClick={() => {
                ipcRenderer.send("batchProcess", "start");
                // dialog.showOpenDialog({
                //   properties: ["openFile"],
                // });
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
                value={good.length}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckOutlined />}
                suffix="Ips"
              />
              <Statistic
                title="Bad"
                value={bad.length}
                precision={0}
                valueStyle={{ color: "#cf1322" }}
                prefix={<WarningOutlined />}
                suffix="Ips"
              />
              <Statistic
                title="Scanning"
                value={processing.length}
                precision={0}
                prefix={<DotChartOutlined />}
                suffix="Ips"
              />
            </div>
          </Card>
        </div>
        <div className="toplog"></div>
        <div className="info">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Good" key="1">
              <IPDisplay data={good} />
            </TabPane>
            <TabPane tab="Bad" key="2">
              <IPDisplay data={bad} />
            </TabPane>
            <TabPane tab="Processing" key="3">
              <Processing data={processing} />
            </TabPane>
          </Tabs>
        </div>
        {/* RESULT DISPLAY */}
      </div>
    </div>
  );
}

export default Batch;
