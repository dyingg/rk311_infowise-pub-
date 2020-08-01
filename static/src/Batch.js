import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";

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

function ResultTitle({ programState, signature }) {
  if (programState == "Idle") {
    return (
      <>
        <Title level={4}>Awaiting Input</Title>
        <Paragraph>Please enter an IP to analyze</Paragraph>
      </>
    );
  } else if (programState == "Detecting") {
    return (
      <>
        <Title level={3}>Detecting</Title>
        <Paragraph>Running modules...</Paragraph>
      </>
    );
  } else if (programState == "Bad") {
    return (
      <>
        <Title type="danger" level={3}>
          VPN/Proxy Detected
        </Title>
        <Paragraph>This IP is a VPN/Proxy {signature}</Paragraph>
      </>
    );
  } else {
    return (
      <>
        <Title level={3}>Good Ip</Title>
        <Paragraph>A VPN or Proxy was not detected</Paragraph>
      </>
    );
  }
}

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
  }, []);

  return (
    <div>
      <div className="App">
        <div className="ipBox">
          <div>
            <Title level={3}>Proxy VPN Check</Title>
            <Paragraph className="subtitle">
              Start a comprehensive check to determine whether the given IP is a
              VPN or Proxy
            </Paragraph>
          </div>
          <Search
            placeholder="127.0.0.1"
            loading={programState == "Detecting" ? true : false}
            enterButton
            onSearch={(value) => {
              updateIp(value);
              updateProgramState("Detecting");
              ipcRenderer.send("thirdPartyRecon", value);
              ipcRenderer.send("startWhoisModule", value);
            }}
          />
          <Button type="primary" shape="circle">
            <ProfileOutlined
              onClick={async () => {
                console.log(
                  dialog.showOpenDialog({
                    properties: ["openFile"],
                  })
                );
              }}
            />
          </Button>
        </div>
        <div className="toplog"></div>
        <div className="info">
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="WHOIS Analysis" key="1">
              <WHOIS data={whoisData} />
            </TabPane>
            <TabPane tab="Third Party Analysis" key="2">
              <ThirdParty data={thirdPartData} />
            </TabPane>
          </Tabs>
        </div>
        {/* RESULT DISPLAY */}
        <div className="result">
          <Card bordered={true} style={{ width: "100%" }}>
            <div className="result">
              <div>
                <Progress
                  type="circle"
                  percent={score}
                  width={80}
                  status={score > 65 ? "exception" : ""}
                  format={(percent) => percent + "%"}
                />
              </div>
              <div>
                <ResultTitle
                  programState={programState}
                  signature={signatureMatched}
                />
              </div>
              <div>
                <Title level={3}>{ip}</Title>
                <Paragraph>Infowise Beta 0.5</Paragraph>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Batch;
