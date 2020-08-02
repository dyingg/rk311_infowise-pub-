import React from "react";
import { Table, Tag, Space, Button } from "antd";

const columns = [
  {
    title: "IP",
    dataIndex: "ip",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Score",
    dataIndex: "result",
    key: "result",
    render: (tag) => {
      let color = "green";
      if (tag > 55) {
        color = "volcano";
      }
      return <Tag color={color}>{tag}</Tag>;
    },
  },
  {
    title: "Action",
    key: "score",
    dataIndex: "score",
    render: (tag) => {
      return <Button>Details</Button>;
    },
  },
];

function WHOISData({ data }) {
  return (
    <div className="third-party">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: "350px" }}
      />{" "}
    </div>
  );
}

export default WHOISData;
