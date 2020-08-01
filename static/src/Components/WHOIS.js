import React from "react";
import { Table, Tag, Space } from "antd";

const columns = [
  {
    title: "Inspector Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "status",
  },
  {
    title: "Score",
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
