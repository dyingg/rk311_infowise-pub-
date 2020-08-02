import React from "react";

import { Table, Tag, Space, Button } from "antd";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
const columns = [
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Time Stamp",
    dataIndex: "timestamp",
    key: "timestamp",
  },
  {
    title: "Action",
    key: "_id",
    dataIndex: "_id",
    render: (tag) => {
      return (
        <Button
          onClick={() => {
            ipcRenderer.send("render-report", tag);
            alert("Report saved");
          }}
        >
          Details
        </Button>
      );
    },
  },
];

function WHOISData({ data }) {
  return (
    <div className="third-party">
      <Table
        columns={columns}
        dataSource={data}
        pagination={true}
        scroll={{ y: "350px" }}
      />{" "}
    </div>
  );
}

export default WHOISData;
