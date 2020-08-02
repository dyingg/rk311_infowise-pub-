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
const { Title } = Typography;
const electron = window.require("electron");
const remote = electron.remote;
const dialog = remote.dialog;

const ipcRenderer = electron.ipcRenderer;

function LogSearch() {
  let [data, updateData] = useState([]);

  useEffect(() => {
    ipcRenderer.on("updateRecent", (e, v) => updateData(v));
    ipcRenderer.send("getRecent");

    return function cleanup() {
      ipcRenderer.removeAllListeners("updateRecent");
    };
  });

  return (
    <div>
      <div className="App">
        <div className="ipBox"></div>
        <div className="log-info">
          <Logging dataSource={data} />
        </div>
        {/* RESULT DISPLAY */}
      </div>
    </div>
  );
}

export default LogSearch;
