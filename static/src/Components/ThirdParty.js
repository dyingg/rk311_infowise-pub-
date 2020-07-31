import React from "react";
import { Table, Tag, Space } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
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
];

function ThirdParty({ data }) {
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

export default ThirdParty;
