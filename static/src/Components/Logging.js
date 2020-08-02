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
    render: (tag) => {
      return <p>{tag.toString()}</p>;
    },
  },
  {
    title: "Score",
    key: "score",
    dataIndex: "score",
    render: (tag) => {
      let color = "green";
      if (tag > 50) {
        color = "volcano";
      }
      return <Tag color={color}>{tag}</Tag>;
    },
  },
  {
    title: "Action",
    key: "reportId",
    dataIndex: "reportId",
    render: (tag) => {
      return (
        <Button
          onClick={() => {
            ipcRenderer.send("render-report", tag);
          }}
        >
          Details
        </Button>
      );
    },
  },
];

function WHOISData({ dataSource }) {
  console.log(dataSource);
  return (
    <div className="third-party">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={true}
        scroll={{ y: "550px" }}
      />{" "}
    </div>
  );
}

export default WHOISData;
