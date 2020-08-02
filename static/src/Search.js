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

import Logging from "./Components/Logging";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;
const { Paragraph } = Typography;
const electron = window.require("electron");
const remote = electron.remote;
const dialog = remote.dialog;

const ipcRenderer = electron.ipcRenderer;

function LogSearch() {
  function callback(key) {
    console.log(key);
  }

  return (
    <div>
      <div className="App">
        <div className="">
          <div>
            <Title level={3}>Search Logs</Title>
          </div>
          <Search
            placeholder="127.0.0.1"
            enterButton
            onSearch={(value) => {}}
          />
        </div>
        <br />
        <div className="log-info">
          <Logging />
        </div>
        {/* RESULT DISPLAY */}
      </div>
    </div>
  );
}

export default LogSearch;
