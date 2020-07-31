import React from "react";
import { DingdingOutlined } from "@ant-design/icons";
import { Typography, TimePicker } from "antd";

import "./../assets/TrafficLights.scss";

const { Title } = Typography;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const { BrowserWindow } = electron.remote;
// Retrieve focused window

// Execute common tasks
// Minimize

// Maximize app

// Close app
const theWindow = BrowserWindow.getFocusedWindow();

function TitleBar() {
  return (
    <div className="title-bar">
      <DingdingOutlined style={{ fontSize: "30px", color: "#ffffff" }} />
      <Title level={3} style={{ color: "#ffffff" }}>
        InfoWise{" "}
      </Title>

      <div class="actions focus">
        <div class="traffic-lights focus">
          <button
            class="traffic-light traffic-light-close"
            id="close"
            onClick={() => {
              theWindow.close();
            }}
          ></button>
          <button
            class="traffic-light traffic-light-minimize"
            id="minimize"
            onClick={() => {
              theWindow.minimize();
            }}
          ></button>
          <button
            class="traffic-light traffic-light-maximize"
            id="maximize"
            onClick={() => {
              theWindow.maximize();
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default TitleBar;
