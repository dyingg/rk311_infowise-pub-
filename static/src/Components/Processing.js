import React from "react";
import { Table, Tag, Space, Button } from "antd";

const columns = [
  {
    title: "IP",
    dataIndex: "ip",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
];

function ProcessingTable({ data }) {
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

export default ProcessingTable;
