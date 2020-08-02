import React from "react";
import { Table, Tag, Space } from "antd";

const columns = [
  {
    title: "IP",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Score",
    dataIndex: "time",
    key: "status",
  },
  {
    title: "Action",
    key: "score",
    dataIndex: "score",
    render: (tag) => {
      let color = "green";
      if (tag > 21) {
        color = "volcano";
      }
      return <Tag color={color}>{tag}</Tag>;
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
