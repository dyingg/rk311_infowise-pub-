import React, { useState, useEffect } from "react";
import "./App.scss";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

import { Layout } from "antd";

import TitleBar from "./Components/TitleBar";
import ContentManager from "./ContentManager";
import { connect } from "mongoose";

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;

function App() {
  let [content, updateContent] = useState(0);
  let [networkStatus, updateNetwork] = useState("online");
  const handleClick = (e) => {
    console.log("click ", e);
    updateContent(e.key);
  };

  return (
    <>
      <TitleBar />
      <Layout>
        <Sider>
          <Menu
            onClick={handleClick}
            style={{ width: 200, height: "100vh" }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <AreaChartOutlined />
                  <span>Test IPS</span>
                </span>
              }
            >
              <Menu.ItemGroup key="g1" title="Single IPs">
                <Menu.Item key="1">Complete Test</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup key="g2" title="Batch IPs">
                <Menu.Item key="3">Batch Test</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Reports">
              <Menu.Item key="5">Search</Menu.Item>
              <Menu.Item key="6">History</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <SettingOutlined />
                  <span>Settings</span>
                </span>
              }
            >
              <Menu.Item key="9">Cloud</Menu.Item>
              <Menu.Item key="10">Module Preferences</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content>
          <ContentManager content={content} />
        </Content>
      </Layout>
    </>
  );
}

export default App;
